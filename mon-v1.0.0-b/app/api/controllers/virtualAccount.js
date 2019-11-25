const virtualAccount = require('../models/virtualAccount');
const dateFormat = require('dateformat');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();

module.exports = {
    create: (req, res, next) => {
        req.body.newAccountId = Math.floor(Math.random() * 10000000000);
        virtualAccount.create(req.body, (err, result) => {
            if (err) {
                next(err);
            } else {
                res.status('200').json({
                    status: "success",
                    message: "New Account Created",
                    data: result
                });
            }
        });
    },

    getAccountById: (req, res, next) => {
        virtualAccount.find({newAccountId: req.query.userId}, (err, data) => {
            if (err) {
                next(err);
            } else {
                res.json({status: "success", data});
            }
        })
    },
    getAll:(req, res, next)=>{
        virtualAccount.find( {'userId' : jwt.decode(req.get('x-access-token')).id} , (err, data)=>{
            if(err){
                next(err);
            } else {
                res.json({status: "success", data});
            }
        })
    },
    remove: (req, res, next) => {
        virtualAccount.deleteOne({"_id": req.body._id}, function (err, virtualAccountInfo) {
            if (err) {
                next(err);
            } else {
                res.status(200).json({
                    status: "success",
                    message: 'Selected Account has been removed'
                });
            }
        })
    },
    update: (req, res, next) => {
        virtualAccount.findOne({"_id": req.body._id}, function (err, virtualAccountInfo) {
            if (err) {
                next(err);
            } else {
                if (virtualAccountInfo == null) {
                    res.status(403 || 500).json({
                        httpStatusCode: '403',
                        status: "error",
                        message: 'Can not find virtualAccount',
                    });
                } else {
                    virtualAccountInfo.accountName = req.body.accountName;
                    virtualAccountInfo.accountDescription = req.body.accountDescription;

                    virtualAccountInfo.save()

                    res.status(200).json({
                        status: "success",
                        message: 'Account has been updated',
                        body: virtualAccountInfo
                    });
                }
            }
        });
    },
    
};
