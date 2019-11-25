const virtualTerminalModel = require('../models/virtualTerminal');
const request = require('request');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const filterOption = require('./filterLogic');
var dateFormat = require('dateformat');
var htmlContent = require('./htmlcontent')
const sgMail = require('@sendgrid/mail');
dotenv.config();

module.exports = {

    create:(req, res, next)=>{
        let userInfo = JSON.parse(req.body.userInfo);
        if(req.body.billingInformation.initialAmount != '0.00'){
            const data={
                parent_id: process.env.ACTUM_PARENT_ID,
                sub_id: process.env.ACTUM_SUB_ID,
                pmt_type: process.env.ACTUM_PTM_TYPE,

                //customer Information'
                companyname: req.body.customerInformation.companyName,
                custname: req.body.customerInformation.customerName,
                custphone: req.body.customerInformation.customerPhone,
                custemail: req.body.customerInformation.customerEmail,
                custaddress1: req.body.customerInformation.address1,
                custaddress2: (req.body.customerInformation.address2 != "" || req.body.customerInformation.address2 != undefined) ? req.body.customerInformation.address2 : 'N/A',
                custcity: req.body.customerInformation.city,
                custstate: req.body.customerInformation.stateProvince,
                custzip: req.body.customerInformation.zipCode,
                custssn: req.body.customerInformation.last_4ssn,
                clientHostName: req.body.clientHostName,

                //payment Information
                chk_acct: req.body.paymentInformation.accountNumber,
                enc_acct: req.body.paymentInformation.accountNumber.replace(/.(?=.{4})/g, 'x'),
                chk_aba: req.body.paymentInformation.routingNumber,
                acct_type: req.body.paymentInformation.accountType, //C checking, S Saving

                //billing information
                trans_modifier: req.body.billingInformation.transactType,
                initial_amount: req.body.billingInformation.initialAmount ,
                billing_cycle: req.body.billingInformation.billingCycle,

                //other information
                merordernumber: req.body.otherInformation.orderdCustomerName,
                comments: req.body.otherInformation.customerComment
            };
            request.post({url :process.env.ACTUM_API_URL,  form: data}, (err, httpResponse, body)=>{
                var objectData = httpResponse.body.split('\n');
                var newstringwith = '{';
                body.split(/\r?\n/).forEach((data,index)=>{
                    if(data !== null){
                        newstringwith += '"'+data.replace('=','":"')+'",';
                    }
                })
                newstringwith += '}';
                req.body.otherInformation.returnresponse = JSON.parse(newstringwith.replace(',"",',''));
                req.body.otherInformation.insertedbyId = jwt.decode(req.get('x-access-token')).id;
                req.body.otherInformation.userIp = req.ip;
                req.body.otherInformation.userDevice = req.headers['user-agent'];
                req.body.otherInformation.submitingData = new Date();
                req.body.paymentInformation.returnStatus = 1;
                req.body.paymentInformation.returnDate = new Date();

                if(objectData[0].split('=')[1] == "Accepted") {

                    virtualTerminalModel.create(req.body, (err, result)=>{
                        if(err){
                            next(err);
                        } else {
                            let userEmail='', username='';
                            if(userInfo[0] != undefined){
                                userEmail = userInfo[0].email;
                                username =userInfo[0].name;
                            } else {
                                userEmail = userInfo.email;
                                username = userInfo.name;
                            }
                            data.transactionId = result._id;
                            data.transacLink = data.clientHostName+'#/analytics/transaction/email|'+result._id;
                            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                            const msg = {
                            to: userEmail,
                            from: 'Transaction Submission <info@monarch.com>',
                            subject: 'Monarch Virtual Terminal',
                            html: htmlContent(username,data)
                        };
                        sgMail.send(msg);
                        res.json({ status: "success", message: objectData[1].split('=')[1], data: body });
                        }
                    })
                } else {
                    virtualTerminalModel.create(req.body, (err, result)=>{
                        if(err){
                            next(err);
                        } else {
                            res.status(400).json({ status: "error", message: objectData[1].split('=')[1], data: body });
                        }
                    })
                }
            })
        } else {
            res.status(400).json({ status: "error", message: 'Please Enter the right amount.' });
        }

    },
    fetchById:(req, res, next)=>{
        virtualTerminalModel.findOne({
            '_id' : req.params.orderId
        }, function (err, transactionData) {
            if (err) {
        		next(err);
        	} else {
        		res.json({status:"success", message: "Order id found!!!", data:{transactionId: transactionData}});
        	}
        });
    },
    getallData:(req, res, next)=>{
       let virtualTerminalList = [];
       let params = {};
       if(req.params.status != undefined){
           params = {
            'otherInformation.insertedbyId':jwt.decode(req.get('x-access-token')).id,
            'otherInformation.returnresponse.status':req.params.status
           }
       } else{
           params={
            'otherInformation.insertedbyId':jwt.decode(req.get('x-access-token')).id
           }
       }

        function vtResponse (err, vTLists){
            if (err){
                next(err);
            } else{
                for (let vTList of vTLists) {
                    virtualTerminalList.push({
                        id: vTList._id,
                        customerInformation: vTList.customerInformation,
                        paymentInformation: vTList.paymentInformation ,
                        billingInformation: vTList.billingInformation ,
                        otherInformation: vTList.otherInformation,
                        submitingData: dateFormat(vTList.otherInformation.submitingData,"mmmm dS, yyyy, h:MM TT" )
                    });
                }
                res.json({status:"success", data:{virtualTerminalList: virtualTerminalList}});
            }
        }

       if(req.query.limit){
           let limit = req.query.limit
           limit = parseInt(limit)
           virtualTerminalModel.find(params, vtResponse).limit(limit);
       } else {
           virtualTerminalModel.find(params, vtResponse);
       }
    },
    getVTByDate:(req, res, next)=>{
        let params = {
            'otherInformation.insertedbyId':jwt.decode(req.get('x-access-token')).id,
            'otherInformation.submitingData' : { "$gte": new Date(req.body.startDate), "$lte": new Date(req.body.endDate+' 23:59:59')},
            'otherInformation.returnresponse.status':req.body.transactionStatus,
            'capture_type':req.body.submissionType
        };
        for(var key in params) {
            if(typeof params[key] == 'object'){
                for(var newkey in  params[key]){
                    if(params[key][newkey] == "Invalid Date"){
                        delete params[key][newkey]
                    }
                }
                if(Object.entries(params[key]).length === 0){
                    delete params[key]
                }
            }
            if(params[key] === undefined) {
               delete params[key]
            }
        }
        virtualTerminalModel.find(params, function(err, vTLists){
            let virtualTerminalList = [];
            if (err){
                next(err);
            } else{
                for (let vTList of vTLists) {
                    virtualTerminalList.push({
                        id: vTList._id,
                        customerInformation: vTList.customerInformation,
                        paymentInformation: vTList.paymentInformation ,
                        billingInformation: vTList.billingInformation ,
                        otherInformation: vTList.otherInformation,
                        transactType: vTList.capture_type,
                        submitingData: dateFormat(vTList.otherInformation.submitingData,"mmmm dS, yyyy, h:MM TT" )
                     });
                }
                res.json({status:"success", data:{virtualTerminalList: virtualTerminalList}});
            }

        });
    }
}
