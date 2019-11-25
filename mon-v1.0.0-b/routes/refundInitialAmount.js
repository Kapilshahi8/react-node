const express = require('express');
const router = express.Router();
const refundInitialAmount = require('../app/api/controllers/refundInitialAmount');

router.post('/refundInitialAmount', refundInitialAmount.create);

module.exports=router;
