const userModel = require('../models/users');
const nachaNodel = require('../models/nacha')
const vx_vtModel = require('../models/virtualTerminal');
const refundModel = require('../models/refundInitialAmount')
const request = require('request');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const uuidv4 = require('uuid');
var nach = require('nach2');
const EntryAddenda = require('nach2/lib/entry-addenda');
const moment = require('moment')
const fs = require('fs')
const lodash = require('lodash')


dotenv.config();


module.exports = {
    create: (req, res, next) => {
        try {
            var file = new nach.File({
                immediateDestination: '081000032',
                immediateOrigin: '123456789',
                immediateDestinationName: 'Some Bank',
                immediateOriginName: 'Your Company Inc',
                referenceCode: '#A000001',
            });

            var batch = new nach.Batch({
                serviceClassCode: '220',
                companyName: 'Your Company Inc',
                standardEntryClassCode: 'WEB',
                companyIdentification: '123456789',
                companyEntryDescription: 'Trans Description',
                companyDescriptiveDate: moment(nach.Utils.computeBusinessDay(8)).format('MMM D'),
                effectiveEntryDate: nach.Utils.computeBusinessDay(8),
                originatingDFI: '081000032'
            });

            var entry = new nach.Entry({
                receivingDFI: '081000210',
                DFIAccount: '5654221',
                amount: '175',
                idNumber: 'RAj##32b1kn1bb3',
                individualName: 'Luke Skywalker',
                discretionaryData: 'A1',
                transactionCode: '22'
            });

            var addenda = new EntryAddenda({
                paymentRelatedInformation: "0123456789ABCDEFGJIJKLMNOPQRSTUVWXYXabcdefgjijklmnopqrstuvwxyx"
            });

            entry.addAddenda(addenda);
            batch.addEntry(entry);
            file.addBatch(batch);

            file.generateFile(function (result) {
                fs.writeFile('NACHA.txt', result, function (err) {
                    if (err) console.log(err);
                    else {
                        const dataNacha = {
                            userId: jwt.decode(req.get('x-access-token')).id,
                            nacha: result
                        };
                        nachaNodel.update({userId: jwt.decode(req.get('x-access-token')).id}, dataNacha, {upsert: true}, async function (err, data) {
                            const paramsVx_vt = {
                                'otherInformation.insertedbyId': jwt.decode(req.get('x-access-token')).id,
                                'nacha_file_created': {'$ne': 1}
                            };
                            const vx_vt = await vx_vtModel.find(paramsVx_vt);
                            const vx_vtIds = lodash.flatMap(vx_vt, '_id');

                            console.log(vx_vtIds)

                            vx_vtModel.update(
                                {_id: {$in: vx_vtIds}},
                                {$set: {nacha_file_created: 1}},
                                {"multi": true},

                                (err, writeResult) => {
                                    console.log(err, writeResult)
                                    res.status(200).json({message: 'success', url: 'nacha/download/'})
                                })
                        });
                    }
                });
            });
        } catch (e) {
            console.log(e)
        }
    },

    getReportData: async (req, res, next) => {
        const paramsVx_vt = {
            'otherInformation.insertedbyId': jwt.decode(req.get('x-access-token')).id,
            'nacha_file_created': {'$ne': 1}
        };

        const vx_vt = await vx_vtModel.find(paramsVx_vt);
        const vx_vtIds = lodash.flatMap(vx_vt, 'otherInformation.returnresponse.order_id');

        const paramsRefund = {
            "order_id": {'$in': vx_vtIds}
        };

        const refund = await refundModel.find(paramsRefund);

        let vx_vtAmount = 0;
        let refundAmount = 0;
        vx_vt.forEach(item => {
            vx_vtAmount += parseFloat(item.billingInformation.initialAmount)
        })

        refund.forEach(item => {
            refundAmount += parseFloat(item.initial_amount)
        })

        res.status(200).json({
            vxvtTotalCount: vx_vt.length,
            refundTotal: refund.length,
            vxvtTotalAmount: vx_vtAmount,
            refundTotalAmount: refundAmount
        })
    },

    download: (req, res, next) => {
        const paramsVx_vt = {
            'otherInformation.insertedbyId': jwt.decode(req.get('x-access-token')).id,
            'nacha_file_created': {'$ne': 1}
        };

        res.download(`${__dirname}/../../../NACHA.txt`)
    }
}
