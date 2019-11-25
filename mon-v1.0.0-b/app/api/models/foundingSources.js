const mongoose = require('mongoose');

//Defines a Schema
const Schema = mongoose.Schema;

const foundingSources = new Schema({
    userId: {
        type: String,
        required: true
    },
    bankName: {
        type: String,
        maxlength: 50,
        trim: true
    },
    dda: {
        type: Number,
        minLength: 7,
        trim: true
    },
    routing: {
        type: Number,
        minLength: 9,
        maxLength: 9,
        trim: true
    }

});

module.exports = mongoose.model('foundingSources', foundingSources, 'user_founding_option');
