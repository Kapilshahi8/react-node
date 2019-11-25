//importing all the required packages
  const express = require('express');
  var cors = require('cors');
  const morgan = require('morgan');
  var winston = require('./config/winston');
  const bodyParser = require('body-parser');
  //controller
  const users = require('./routes/users');
  const virtualTerminal = require('./routes/virtualTerminal');
  const billRate = require('./routes/billRates');
  const refundInitialAmount = require('./routes/refundInitialAmount');
  const chart = require('./routes/chart');
  const foundingSources = require('./routes/foundingSource');
  const transacLedger = require('./routes/transacLedger');
  const nachaSources = require('./routes/nacha');
  const applications = require('./routes/applications');
  const virtualAccount = require('./routes/virtualAccount');
//middleware
  const authenticateToken = require('./app/api/middleware/authenticateToken');

  const mongoose = require('./config/database');
  const environment = process.env.NODE_ENV; // development
  var jwt = require('jsonwebtoken');
  const app = express();

  morgan.format(
    "myformat",
    '[:date[clf]] ":method :url" :status :remote-addr :remote-user :res[content-length] - Response-time :response-time ms'
  );
  app.use(
    morgan("myformat", {
        stream: winston.stream
    })
 );

  //intiallize the app
    app.set('secretKey', 'nodeRestApi'); // jwt secret token

    mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
    app.use(cors());
    app.use(bodyParser.json());
    app.use('/', bodyParser.json());

    if (environment !== 'production') {
      // and this
     // app.use('/', logger('dev'));
    }
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    app.get('/', function(req, res){
      res.json({"Message" : "Welcome to the pinkpineapple rest api portal."});
    });

    // public route
    app.use('/users', users);
    app.use('/virtualTerminal',validateUser, virtualTerminal);
    app.use('/verifyToken',validateUser, authenticateToken);
    app.use('/billRate',validateUser, billRate);
    app.use('/transacLedger',validateUser, transacLedger);
    app.use('/refund', validateUser, refundInitialAmount);
    app.use('/chart', validateUser, chart);
    app.use('/foundingSources', validateUser, foundingSources);
    app.use('/nacha', validateUser, nachaSources);
    app.use('/applications', applications);
    //Virtual Account
    app.use('/virtualAccount', validateUser,virtualAccount);
    
    // express doesn't consider not found 404 as an error so we need to handle 404 it explicitly
    // handle 404 error
    app.use(function(req, res, next) {
      let err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // handle errors
    app.use(function(err, req, res, next) {
      if(err.status === 404)
        res.status(404).json({message: "Not found"});
      else
        res.status(500).json({message: "Something looks wrong :( !!!"});

    });

    app.listen(3001, function(){
      console.log('Node server listening on port 3001');
    });

    function validateUser(req, res, next) {
      jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function(err, decoded) {
        if (err) {
          res.status(403).json({status:"error", message: err.message, data:null});
        }else{
          // add user id to request
          req.body.userId = decoded.id;
          next();
        }
      });

    }

    // POST http://localhost:3000/users/register
    // POST http://localhost:3000/users/authenticate

