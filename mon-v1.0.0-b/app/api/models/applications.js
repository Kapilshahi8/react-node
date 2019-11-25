const mongoose = require('mongoose');


//Define a schema
const Schema = mongoose.Schema;

const ApplicationSchema = new Schema({
    app_name: {
        type: String,
        trim: true,
        required: true,
    },
    api_key: {
        type: String,
        trim: true,
        required: true
    },
    app_id: {
        type: String,
        trim: true,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Application', ApplicationSchema, 'Application');

