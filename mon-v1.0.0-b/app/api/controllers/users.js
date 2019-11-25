const userModel = require('../models/users');
const applicationsModel = require('../models/applications');
const foundingSources = require('../models/foundingSources');
const request = require('request');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const uuidv4 = require('uuid');
const lodash = require('lodash');
dotenv.config();


module.exports = {
    create: (req, res, next) => {
        req.body.connection = process.env.CONNECTION;
        request.post({
            url: process.env.API_BASE_URL + 'dbconnections/signup',
            form: req.body
        }, (err, httpResponse, body) => {
            if (httpResponse.statusCode == 200) {
                userModel.create({
                    name: req.body.name,
                    email: lodash.toLower(req.body.email),
                    password: req.body.password,
                    user_metadata: req.body.user_metadata
                }, (err, result) => {
                    if (err) {
                        next(err);
                    } else {
                        // applicationsModel.create({
                        //     app_name: result['user_metadata']['companyName'] + "s API KEY",
                        //     api_key: uuidv4(),
                        //     app_id: uuidv4().substr(4, 9).replace("-", ''),
                        //     userId: result['_id']
                        // });
                        res.json({status: "success", message: "User added successfully!!!", data: result});
                    }
                });
            } else {
                res.json(JSON.parse(body));
            }
        })
    },

    authenticate: (req, res, next) => {
        const headers = {
            'Content-Type': 'application/json',
            'Origin': process.env.APPLICATION_ORIGIN
        }
        req.body.client_id = process.env.CLIENT_ID
        req.body.realm = process.env.CONNECTION
        req.body.credential_type = process.env.CREDENTIAL_TYPE
        //Authenticate
        request.post({url: process.env.API_BASE_URL + 'co/authenticate', form: req.body, headers}, (err,
                                                                                                    httpResponse, body) => {
            if (httpResponse.statusCode == 200) {
                const managenentToken = {
                    client_id: process.env.MANAGEMENT_CLIENT_ID,
                    client_secret: process.env.MANAGEMENT_CLIENT_SECRET_KEY,
                    audience: process.env.MANAGEMENT_API_AUDIENCE,
                    grant_type: 'client_credentials'
                }
                //retrieve the management token value from the
                request.post({
                    url: process.env.API_BASE_URL + 'oauth/token',
                    form: managenentToken,
                    headers
                }, (err, httpResponse, body) => {
                    const bearerToken = JSON.parse(body).access_token
                    const managementHeader = {
                        'Authorization': 'Bearer ' + bearerToken
                    }
                    const userEmail = req.body.username;
                    //retrive the user information
                    request.get(
                        {
                            url: process.env.MANAGEMENT_API_AUDIENCE + 'users-by-email?email=' + userEmail.toLowerCase(),
                            headers: managementHeader
                        }, (err, httpResponse, body) => {
                            userModel.findOne({email: req.body.username}, function (err, userInfo) {
                                if (err) {
                                    next(err);
                                } else {
                                    if (userInfo == null) {
                                        res.status(403 || 500).json({
                                            httpStatusCode: '403',
                                            status: "error",
                                            message: 'Wrong email id and password',
                                        });
                                    } else {
                                        const token = jwt.sign({id: userInfo._id}, req.app.get('secretKey'), {expiresIn: '1h'});
                                        const parsedBody = JSON.parse(body);
                                        parsedBody[0]['_id'] = userInfo._id;
                                        res.json({
                                            httpStatusCode: httpResponse.statusCode,
                                            status: "success",
                                            message: "User login successfully.",
                                            data: parsedBody,
                                            token: token
                                        });
                                    }
                                }
                            });
                        })
                });

            } else {
                res.status(httpResponse.statusCode || 500).json({
                    httpStatusCode: httpResponse.statusCode,
                    status: "error",
                    message: body.error_description,
                    data: JSON.parse(body)
                });
            }
        })
    },

    forgotPassword: (req, res, next) => {
        req.body.client_id = process.env.CLIENT_ID
        req.body.connection = process.env.CONNECTION
        request.post({
            url: process.env.API_BASE_URL + 'dbconnections/change_password',
            form: req.body
        }, (err, httpResponse, body) => {
            if (err == null) {
                res.status(200).json({status: "success", message: body});
            } else {
                res.status(404).json({status: "failure", message: "Email Id not found"});
            }
        })
    },
    //user fetching by auth0
    getUserById: (req, res, next) => {
        const headers = {
            'Content-Type': 'application/json',
            'Origin': process.env.APPLICATION_ORIGIN
        }
        const managenentToken = {
            client_id: process.env.MANAGEMENT_CLIENT_ID,
            client_secret: process.env.MANAGEMENT_CLIENT_SECRET_KEY,
            audience: process.env.MANAGEMENT_API_AUDIENCE,
            grant_type: 'client_credentials'
        }
        const userId = req.body.Id;
        request.post({
            url: process.env.API_BASE_URL + 'oauth/token',
            form: managenentToken,
            headers
        }, (err, httpResponse, body) => {
            const bearerToken = JSON.parse(body).access_token
            const managementHeader = {
                'Authorization': 'Bearer ' + bearerToken
            }
            //retrive the user information
            request.get(
                {
                    url: process.env.MANAGEMENT_API_AUDIENCE + 'users/' + userId,
                    headers: managementHeader
                }, (err, httpResponse, body) => {
                    if (err == null) {
                        console.log(body)
                        res.status(httpResponse.statusCode).json({status: "success", message: JSON.parse(body)});
                    } else {
                        res.status(httpResponse.statusCode).json({status: "failure", message: "Id not found"});
                    }
                })
        });
    },
    //user fetch data from database
    getUser: (req, res, next) => {
        userModel.findOne(req.body, function (err, userInfo) {
            if (err) {
                next(err);
            }
            if (userInfo != null) {
                userInfo.password = '**************';
                const token = jwt.sign({id: userInfo._id}, req.app.get('secretKey'), {expiresIn: '1h'});
                res.status(200).json({status: "success", message: 'User found', body: userInfo, 'token': token});
            } else {
                res.status(403).json({status: "error", message: 'User not found'});
            }
        })
    },
    createUserInOurDatabase(req, res, next) {
        userModel.create({
            name: req.body.name,
            email: lodash.toLower(req.body.email),
            password: 'pinkpineapple@#321',
            user_metadata: req.body.user_metadata
        }, (err, result) => {
            if (err) {
                next(err);
            } else {
                const tokenvalue = jwt.sign({id: result._id}, req.app.get('secretKey'), {expiresIn: '1h'});

                // applicationsModel.create({
                //     app_name: result['user_metadata']['companyName'] + "s API KEY",
                //     api_key: uuidv4(),
                //     app_id: uuidv4().substr(4, 9).replace("-", ''),
                //     userId: result['_id']
                // });


                res.json({
                    status: "success",
                    message: "User added successfully!!!",
                    'token': tokenvalue,
                    '_id': result['_id']
                });
            }
        });
    },
    updateUserInfo(req, res, next) {
        const headers = {
            'ContentType': 'application/json',
            'Origin': process.env.APPLICATION_ORIGIN
        }
        const managenentToken = {
            client_id: process.env.MANAGEMENT_CLIENT_ID,
            client_secret: process.env.MANAGEMENT_CLIENT_SECRET_KEY,
            audience: process.env.MANAGEMENT_API_AUDIENCE,
            grant_type: 'client_credentials'
        }

        request.post({
            url: process.env.API_BASE_URL + 'oauth/token',
            form: managenentToken,
            headers
        }, (err, httpResponse, body) => {

            const bearerToken = JSON.parse(body).access_token
            const managementHeader = {
                'Authorization': 'Bearer ' + bearerToken
            }

            let connectionName = req.params.id.split('|')[0]
            connectionName = connectionName == 'auth0' ? process.env.CONNECTION : connectionName

            req.body.connection = connectionName

            const dataToSend = req.body
            const email = req.body.email
            let bankAccount = {}
            if (req.body.user_metadata && req.body.user_metadata.routing) {
                bankAccount = {
                    routing: req.body.user_metadata.routing,
                    bankName: req.body.user_metadata.bankName,
                    dda: req.body.user_metadata.dda,
                };
                delete dataToSend.user_metadata.routing
                delete dataToSend.user_metadata.bankName
                delete dataToSend.user_metadata.dda
            }
            delete dataToSend.email
            let tokenData = {
                app_name: req.body.user_metadata['companyName'] + "s API KEY",
                api_key: uuidv4(),
                app_id: uuidv4().substr(4, 9).replace("-", ''),
            }

            request.patch({
                url: process.env.MANAGEMENT_API_AUDIENCE + `users/${req.params.id}`,
                form: dataToSend,
                headers: managementHeader
            }, (err, httpResponse, body) => {
                if (httpResponse.statusCode == 200) {
                    const parsed = JSON.parse(body)
                    const dataForDB = {
                        user_metadata: parsed.user_metadata,
                        app_metadata: parsed.app_metadata || {}
                    }

                    userModel.findOne({email: email}, function (err, userInfo) {
                        if (err) {
                            next(err);
                        } else {
                            if (userInfo == null) {
                                res.status(403 || 500).json({
                                    httpStatusCode: '403',
                                    status: "error",
                                    message: 'Can not update user',
                                });
                            } else {
                                if (bankAccount && bankAccount.routing) {
                                    bankAccount.userId = userInfo['_id']

                                    foundingSources.create(bankAccount, (err, result) => {
                                    });
                                }


                                if (req.body.user_metadata && req.body.user_metadata.api_access == 1) {
                                    applicationsModel.create({
                                        userId: userInfo['_id'],
                                        ...tokenData
                                    });
                                }

                                userInfo.user_metadata = {...userInfo.user_metadata, ...dataForDB.user_metadata}
                                userInfo.app_metadata = {...userInfo.app_metadata, ...dataForDB.app_metadata}

                                userInfo.save()
                                res.status(200).json({status: "success", message: 'User updated', body: parsed});
                            }
                        }
                    });
                } else {
                    res.json(JSON.parse(body));
                }
            })


        });


    },

    getApplicationInfo(req, res, next) {
        const userId = req.params.id;
        applicationsModel.findOne({
            userId: userId
        }, function (err, appInfo) {
            if (err) {
                next(err);
            }
            if (appInfo != null) {
                res.status(200).json({status: "success", message: 'Application found', body: appInfo});
            } else {
                res.status(403).json({status: "error", message: 'Application not found'});
            }
        })
    },

    revokeOrCreateToken(req, res, next) {
        const userId = req.body.userId;
        applicationsModel.findOne({
            userId: userId
        }, function (err, appInfo) {
            if (err) {
                next(err);
            }
            if (appInfo != null) {
                appInfo.api_key = uuidv4();
                appInfo.app_id = uuidv4().substr(4, 9).replace("-", '');
                appInfo.save()
                res.status(200).json({status: 'success', message: 'Application Updated', body: appInfo})

            } else {
                const keyData = {
                    app_name: "Monarch API KEY",
                    api_key: uuidv4(),
                    app_id: uuidv4().substr(4, 9).replace("-", ''),
                    userId: userId
                };
                const cr = applicationsModel.create(keyData);

                res.status(200).json({
                    status: 'success', message: 'Application Created', body: keyData
                })
            }
        })
    }
}
