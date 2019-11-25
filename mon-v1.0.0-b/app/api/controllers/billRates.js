const BillRateModel = require('../models/billRate');
const dotenv = require('dotenv');
dotenv.config();

function getTommorow() {
    const todayToTomorrow = new Date();
    //Lets Make tomorrow
    todayToTomorrow.setDate(todayToTomorrow.getDate() + 1);
    todayToTomorrow.setHours(0);
    todayToTomorrow.setMinutes(0);
    todayToTomorrow.setSeconds(0);
    todayToTomorrow.setMilliseconds(0);

    return todayToTomorrow
}

module.exports = {
    create: (req, res, next) => {
        BillRateModel.create(req.body, (err, result) => {
            if (err) {
                console.log(err);
                next(err);
            } else {
                res.json({status: "success", message: "Bill Rate Creates", data: req.body});
            }
        });
    },

    getCurrentBill: (req, res, next) => {

        const tomorrow = getTommorow();

        BillRateModel.find({
            userId: req.body.userId,
            dateCreated: {'$lt': new Date(tomorrow.toISOString())}
        }, (err, data) => {
            if (err) {
                console.log(err)
                next(err);
            } else {
                //console.log(data)
                res.json({status: "success", data});
            }
        }).sort({dateCreated: -1}).limit(1)
    },

    getUpcommingBill: (req, res, next) => {

        const tomorrow = getTommorow()
        console.log(
            {
                userId: req.body.userId,
                dateCreated: {'$gte': new Date(tomorrow.toISOString())}
            }
        )
        BillRateModel.find({
            userId: req.body.userId,
            dateCreated: {'$gte': new Date(tomorrow.toISOString())}
        }, (err, data) => {
            if (err) {
                next(err);
            } else {
                //console.log(data)
                res.json({status: "success", data});
            }
        }).sort({dateCreated: -1}).limit(1)
    },

    update: (req, res, next) => {

        const dataToUpdate = req.body
        BillRateModel.findById(req.params.rateId, (err, rateInfo) => {
            if (err) {
                next(err);
            } else {

                rateInfo.r1 = dataToUpdate.r1;
                rateInfo.r2 = dataToUpdate.r2;
                rateInfo.r3 = dataToUpdate.r3;
                rateInfo.r4 = dataToUpdate.r4;
                rateInfo.r5 = dataToUpdate.r5;
                rateInfo.r6 = dataToUpdate.r6;
                rateInfo.r7 = dataToUpdate.r7;
                rateInfo.r8 = dataToUpdate.r8;
                rateInfo.r9 = dataToUpdate.r9;
                rateInfo.r10 = dataToUpdate.r10;
                rateInfo.r11 = dataToUpdate.r11;
                rateInfo.r12 = dataToUpdate.r12;
                rateInfo.r13 = dataToUpdate.r13;
                rateInfo.r14 = dataToUpdate.r14;
                rateInfo.r15 = dataToUpdate.r15;
                rateInfo.r16 = dataToUpdate.r16;
                rateInfo.r17 = dataToUpdate.r17;
                rateInfo.r18 = dataToUpdate.r18;
                rateInfo.r19 = dataToUpdate.r19;
                rateInfo.r20 = dataToUpdate.r20;
                rateInfo.r21 = dataToUpdate.r21;
                rateInfo.r22 = dataToUpdate.r22;
                rateInfo.r23 = dataToUpdate.r23;
                rateInfo.discountValue = dataToUpdate.discountValue;
                rateInfo.discountType = dataToUpdate.discountType;
                rateInfo.perTransaction = dataToUpdate.perTransaction;
                rateInfo.debit = dataToUpdate.debit
                rateInfo.sameDayDebit = dataToUpdate.sameDayDebit
                rateInfo.credit = dataToUpdate.credit
                rateInfo.sameDayCredit = dataToUpdate.sameDayCredit
                rateInfo.preNote = dataToUpdate.preNote
                rateInfo.refund = dataToUpdate.refund
                rateInfo.applicationFee = dataToUpdate.applicationFee
                rateInfo.settlementTime = dataToUpdate.settlementTime
                rateInfo.reserveAmount = dataToUpdate.reserveAmount

                rateInfo.save()
                res.json({status: "success", rateInfo});
            }
        })

    }
}
