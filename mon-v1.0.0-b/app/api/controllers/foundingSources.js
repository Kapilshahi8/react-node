const foundingSources = require('../models/foundingSources');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    create: (req, res, next) => {
        foundingSources.create(req.body, (err, result) => {
            if (err) {
                next(err);
            } else {
                res.status('200').json({
                    status: "success",
                    message: "Founding Source Added",
                    data: result
                });
            }
        });
    },

    getAll: (req, res, next) => {
        foundingSources.find({userId: req.query.userId}, (err, data) => {
            if (err) {
                next(err);
            } else {
                res.json({status: "success", data});
            }
        })
    },

    update: (req, res, next) => {
        foundingSources.findOne({"_id": req.body._id}, function (err, foundingSourcesInfo) {
            if (err) {
                next(err);
            } else {
                if (foundingSourcesInfo == null) {
                    res.status(403 || 500).json({
                        httpStatusCode: '403',
                        status: "error",
                        message: 'Can not find foundingSources',
                    });
                } else {
                    foundingSourcesInfo.bankName = req.body.bankName;
                    foundingSourcesInfo.dda = req.body.dda;
                    foundingSourcesInfo.routing = req.body.routing;

                    foundingSourcesInfo.save()

                    res.status(200).json({
                        status: "success",
                        message: 'foundingSources updated',
                        body: foundingSourcesInfo
                    });
                }
            }
        });
    },

    remove: (req, res, next) => {
        foundingSources.deleteOne({"_id": req.body._id}, function (err, foundingSourcesInfo) {
            if (err) {
                next(err);
            } else {
                res.status(200).json({
                    status: "success",
                    message: 'foundingSources removed'
                });
            }
        })
    }

};
