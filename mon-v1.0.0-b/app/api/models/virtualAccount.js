const mongoose = require('mongoose');

//Defines a Schema
const Schema = mongoose.Schema;

const virtualAccount = new Schema({
    newAccountId: {
        type: String,
        required: true
    },
    accountName: {
        type: String,
        maxlength: 50,
        trim: true
    },
    accountDescription: {
        type: String,
        maxlength: 1000,
        trim: true
    },
    userId:{
        type: String,
        trim:true
    },
    dateCreated: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('virtualAccount', virtualAccount, 'tx_virtual_account');
