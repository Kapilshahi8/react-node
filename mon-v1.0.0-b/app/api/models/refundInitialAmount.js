const mongoose = require('mongoose');

//Defines a Schema
const Schema = mongoose.Schema;

const refundInitialAmount = new Schema({
    userId: {
        type: String,
        required: true
    },
    actionCode: {
        type: String,
        maxlength:1,
        trim: true
    },
    prev_history_id: {
        type: Number,
        trim: true
    },
    order_id: {
        type: Number,
        trim: true
    },    
    initial_amount: {
        type: Number,
        trim: true
    },
    dateCreated: {
        type: Date,
        required: true
    }

});

module.exports = mongoose.model('refundinitialamount', refundInitialAmount);
