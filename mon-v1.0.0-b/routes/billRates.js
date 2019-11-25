const express = require('express');
const router = express.Router();
const billRatesController = require('../app/api/controllers/billRates');

router.post('/create', billRatesController.create);
router.get('/', billRatesController.getCurrentBill)
router.get('/upcomming', billRatesController.getUpcommingBill)
router.put('/:rateId', billRatesController.update)

module.exports = router;
