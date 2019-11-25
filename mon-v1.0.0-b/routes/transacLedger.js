var express = require('express');
var router = express.Router();
var transacLedgerController = require('../app/api/controllers/transacLedger');

router.get('/calculateAvailableBlnc', transacLedgerController.calculateAvailableBlnc);
router.post('/calculateAvailableBlncByDate', transacLedgerController.calculateAvailableBlnc);
module.exports = router;