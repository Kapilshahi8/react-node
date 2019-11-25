const virtualTerminalModel = require('../models/virtualTerminal');
const refundInitialAmount = require('../models/refundInitialAmount');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();

module.exports = {

    getVirtualTerminalSubmittedTimes:(req, res, next)=>{
        virtualTerminalModel.aggregate([
            { $match : { 'otherInformation.insertedbyId' : jwt.decode(req.get('x-access-token')).id } },
            {
                $group:{
                    _id: { $substr : ['$otherInformation.submitingData', 0, 7]},  //$region is the column name in collection
                    count: {$sum: 1},
                    totalAmount : { $sum: {$toDouble :"$billingInformation.initialAmount" } }
                }
            }
            
            ], (err, httpResponse)=>{
                if (err){
                    console.log(err);
                    next(err);
                }
                else
                {
                    res.json({ status: "success", data: httpResponse });
                }
            })
    },
    getTotalAmountOfRefundByUserId:(req, res, next)=>{
        refundInitialAmount.aggregate([
            { $match : { 'userId' : jwt.decode(req.get('x-access-token')).id } },
            {
                $group:{
                    _id: { $substr : ['$dateCreated', 0, 7]},  //$region is the column name in collection
                    count: {$sum: 1},
                    totalAmount : { $sum: {$toDouble :"$initial_amount" } }
                }
            }
            ], (err, httpResponse)=>{
                if (err){
                    console.log(err);
                    next(err);
                }
                else
                {
                    res.json({ status: "success", data: httpResponse });
                }
            })
    },
    vTLineData:(req, res, next)=>{
        virtualTerminalModel.aggregate([
            { $match : { 'otherInformation.insertedbyId' : jwt.decode(req.get('x-access-token')).id } },
            {
                $group:{
                    _id: { $substr : ['$otherInformation.submitingData', 0, 10]},  //$region is the column name in collection
                    count: {$sum: 1},
                    totalAmount : { $sum: {$toDouble :"$billingInformation.initialAmount" } },
                    TotalTranasactionAmount: {$sum: {$toDouble :"$billingInformation.initialAmount" }},
                    TotalTranasactionCount:{$sum: 1},
                }
            }
            
            ], (err, httpResponse)=>{
                if (err){
                    console.log(err);
                    next(err);
                }
                else
                {
                    res.json({ status: "success", data: httpResponse });
                }
            })
    },
    rFLineData:(req, res, next)=>{
        refundInitialAmount.aggregate([
            { $match : { 'userId' : jwt.decode(req.get('x-access-token')).id } },
            {
                $group:{
                    _id: { $substr : ['$dateCreated', 0, 10]},  //$region is the column name in collection
                    count: {$sum: 1},
                    totalAmount : { $sum: {$toDouble :"$initial_amount" } }
                }
            }
            ], (err, httpResponse)=>{
                if (err){
                    console.log(err);
                    next(err);
                }
                else
                {
                    res.json({ status: "success", data: httpResponse });
                }
            })
    }
}
