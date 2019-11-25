const mongoose = require('mongoose');

//Defines a Schema
const Schema = mongoose.Schema;

const nachaSources = new Schema({
    userId: {
        type: String,
        required: true
    },
    nacha: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('nachaSources', nachaSources, 'nacha');
