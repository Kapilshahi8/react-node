const mongoose = require('mongoose');

//Defines a Schema
const Schema = mongoose.Schema;

const virtualTerminalSchema = new Schema({
    customerInformation: {
        type: Object,
        trim: true,
        required: true
    },
    paymentInformation: {
        type: Object,
        trim: true,
        required: true
    },
    capture_type: {
        type: String,
        trim: true,
        required: true
    },
    billingInformation: {
        type: Object,
        trim: true,
        required: true,
    },
    otherInformation: {
        type: Object,
        trim: true
    },
    insertedbyId: {
        type: Number,
        trim: true
    },
    nacha_file_created: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('tx_ledger', virtualTerminalSchema, 'tx_ledger');

