//Set up mongoose connection
const mongoose = require('mongoose');
var env =process.env.environment;
let mongoDB;
switch (env) {
    case env:"dev"
    mongoDB = process.env.MONGO_LOCAL_CONN_URL;
        break;
    case env:"QA"
    mongoDB = process.env.MONGO_QA_CONN_URL;
    break;
    case env:"PROD"
    mongoDB = process.env.MONGO_PROD_CONN_URL;
    default:
        break;
}

mongoose.connect(mongoDB);
// mongoose.connect('mongodb+srv://userChetu938498:5VWgtWZ4zoJ6dMkl@cluster0-l2nux.mongodb.net/admin');
mongoose.Promise = global.Promise;
module.exports = mongoose;