const mongoose = require('mongoose');

//Defines a Schema
const Schema = mongoose.Schema;

const billRateSchema = new Schema({
    discountValue: {
        type: Number,
        trim: true
    },
    discountType: {
        type: String,
        trim: true,
    },
    perTransaction: {
        type: Number,
        trim: true
    },
    r1: {
        type: Number,
        trim: true
    },
    r2: {
        type: Number,
        trim: true
    },
    r3: {
        type: Number,
        trim: true
    },
    r4: {
        type: Number,
        trim: true
    },
    r5: {
        type: Number,
        trim: true
    },
    r6: {
        type: Number,
        trim: true
    },
    r7: {
        type: Number,
        trim: true
    },
    r8: {
        type: Number,
        trim: true
    },
    r9: {
        type: Number,
        trim: true
    },
    r10: {
        type: Number,
        trim: true
    },
    r11: {
        type: Number,
        trim: true
    },
    r12: {
        type: Number,
        trim: true
    },
    r13: {
        type: Number,
        trim: true
    },
    r14: {
        type: Number,
        trim: true
    },
    r15: {
        type: Number,
        trim: true
    },
    r16: {
        type: Number,
        trim: true
    },
    r17: {
        type: Number,
        trim: true
    },
    r18: {
        type: Number,
        trim: true
    },
    r19: {
        type: Number,
        trim: true
    },
    r20: {
        type: Number,
        trim: true
    },
    r21: {
        type: Number,
        trim: true
    },
    r22: {
        type: Number,
        trim: true
    },
    r23: {
        type: Number,
        trim: true
    },
    userId: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        required: true
    },
    debit: {
        type: Number,
        trim: true
    },
    sameDayDebit: {
        type: Number,
        trim: true
    },
    credit: {
        type: Number,
        trim: true
    },
    sameDayCredit: {
        type: Number,
        trim: true
    },
    preNote: {
        type: Number,
        trim: true
    },
    refund: {
        type: Number,
        trim: true
    },
    applicationFee: {
        type: Number,
        trim: true
    },
    settlementTime: {
        type: Number,
        trim: true
    },
    reserveAmount: {
        type: Number,
        trim: true
    },

});

module.exports = mongoose.model('BillRate', billRateSchema);
