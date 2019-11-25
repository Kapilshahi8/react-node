const refundInitialAmount = require('../models/refundInitialAmount');
const virtualTerminal = require('../models/virtualTerminal');
const request = require('request');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    create: (req, res, next) => {
        req.body.username = process.env.ACTUM_USERNAME;
        req.body.password = process.env.ACTUM_PASSWORD;
        req.body.syspass = process.env.ACTUM_SYSTEM_PASSWORD;
        req.body.dateCreated = new Date();
        // console.log(req.body)
        request.post(
            {
                url: process.env.ACTUM_API_URL,
                form:req.body
            },(err, httpResponse, body)=>{
                // console.log(body);
                var newstringwith = '{';
                body.split(/\r?\n/).forEach((data,index)=>{
                    if(data !== null){
                        newstringwith += '"'+data.replace('=','":"')+'",';
                    }
                })
                newstringwith += '}';
                const returnResponse  = JSON.parse(newstringwith.replace(',"",',''));
                req.body.otherInformation = returnResponse;
                if(returnResponse.status=="Accepted"){
                    refundInitialAmount.create(req.body, (err, result) => {
                        if (err) {
                            // console.log(err);
                            next(err);
                        } else {
                            // const statusCheck = {
                            //     username:process.env.ACTUM_USERNAME,
                            //     password:process.env.ACTUM_PASSWORD,
                            //     syspass:process.env.ACTUM_SYSTEM_PASSWORD,
                            //     action_code:'A',
                            //     order_id:req.body.order_id
                            // }
                            // request.post({url:process.env.ACTUM_API_URL, form:statusCheck }, (err,httpResponse)=>{
                            //     var newstringwith = '{';
                            //     httpResponse.split(/\r?\n/).forEach((data,index)=>{
                            //         if(data !== null){
                            //             newstringwith += '"'+data.replace('=','":"')+'",';
                            //         }
                            //     })
                            //     newstringwith += '}';
                            //     console.log(JSON.parse(newstringwith).refund_status);
                            // })
                            virtualTerminal.findOneAndUpdate({
                                'otherInformation.returnresponse.order_id' : req.body.order_id}, 
                                {
                                    'paymentInformation.returnStatus':0,
                                    'paymentInformation.returnDate': new Date(),
                                    'otherInformation.returnresponse.status':'refunded'
                                 }, {new: true}, (err, doc) => {
                                if (err) {
                                    next(err);
                                }
                                res.status('200').json({status: "success", message: "Refund record saved successfully", data: req.body});
                            });
                        }
                    });
                } else {
                    res.status('403').json({status: "error", message: returnResponse.authcode, data: req.returnResponse});
                }
            })
    }
}
