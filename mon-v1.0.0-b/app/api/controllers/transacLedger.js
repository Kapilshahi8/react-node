const virtualTerminalModel = require('../models/virtualTerminal');
const dateFormat = require('dateformat');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();

module.exports = {
    /**
     * Calculate the available balance for the corresponding user, where jwt is belongs to.
     * 
     * Formula to get the availalbe balance 
     * Available balance = Sales - refunds - returns - fees - any past settlements (payouts in the past)
     * 
     * @param req request from the client
     * @param res response from the server
     * @param next if error generates
     * 
     */
    calculateAvailableBlnc: (req, res, next)=>{
        try {
            let params = {};
            if(req.method == 'GET'){
                params = {
                    'otherInformation.insertedbyId' : jwt.decode(req.get('x-access-token')).id,
                    $or:[{'otherInformation.returnresponse.status': "Accepted"},{'otherInformation.returnresponse.status':"refunded"}],
                }
            } else {
                params = {
                    'otherInformation.insertedbyId' : jwt.decode(req.get('x-access-token')).id,
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
            }
            virtualTerminalModel.find( params, function (err, transactionDetails){
                    if(err){
                        next(err);
                    } else {
                        let totalsubmittedAmount = 0, 
                        totalAcceptedAmount= 0, 
                        totalrefundedAmount = 0, 
                        totalDeclinedAmount= 0;
                        transactionDetails.forEach((data, index)=>{
                        totalsubmittedAmount += parseFloat(data.otherInformation.returnresponse.initial_amount);
                        transactionDetails[index].otherInformation.readingDate = dateFormat(data.otherInformation.submitingData,'ddd, mmm dd yyyy, hh:MM: TT')
                        transactionDetails[index].otherInformation.returnresponse.written_amount = '$ '+data.otherInformation.returnresponse.initial_amount
                        
                        switch (data.otherInformation.returnresponse.status) {
                            case 'Accepted':
                                transactionDetails[index].otherInformation.showDescription = "Successfully debited from "+data.otherInformation.returnresponse.enc_acct+" for $"+data.otherInformation.returnresponse.initial_amount;
                                totalAcceptedAmount += parseFloat(data.otherInformation.returnresponse.initial_amount);
                              break;
                            case 'declined':
                                    transactionDetails[index].otherInformation.showDescription = "Transaction has been declined of $"+data.otherInformation.returnresponse.initial_amount+" to "+data.otherInformation.returnresponse.enc_acct+" in the favor of "+data.otherInformation.returnresponse.custname;
                                    totalDeclinedAmount += parseFloat(data.otherInformation.returnresponse.initial_amount);
                              break;
                            case 'refunded':
                                    transactionDetails[index].otherInformation.showDescription = "Successfully credited to "+data.otherInformation.returnresponse.enc_acct+" for $"+data.otherInformation.returnresponse.initial_amount;
                                    totalrefundedAmount += parseFloat(data.otherInformation.returnresponse.initial_amount);
                              break;
                        }
                        switch (data.capture_type) {
                            case 'vt':
                                transactionDetails[index].capture_type = "Virtual Terminal";
                              break;
                        }
                    })
                    res.json({
                            'totalsubmittedAmount':totalsubmittedAmount,
                            'totalAcceptedAmount':totalAcceptedAmount,
                            'totalrefundedAmount':totalrefundedAmount,
                            'totalDeclinedAmount':totalDeclinedAmount,
                            'totalAvailableBalance': parseFloat(totalAcceptedAmount) - parseFloat(totalrefundedAmount),
                            totalData:transactionDetails
                        });
                    }
                });
        } catch (error) {
            
        }
    }
}