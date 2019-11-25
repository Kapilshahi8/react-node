const express = require('express');
const router = express.Router();
const chart = require('../app/api/controllers/chart');

router.get('/getVTSubmittedTimes', chart.getVirtualTerminalSubmittedTimes)
router.get('/getTotalAmountOfRefundByUserId', chart.getTotalAmountOfRefundByUserId);
router.get('/vTLineData', chart.vTLineData);
router.get('/rFLineData', chart.rFLineData);
module.exports = router;