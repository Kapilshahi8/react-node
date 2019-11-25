const express = require('express');
const router = express.Router();
const applications = require('../app/api/controllers/applications');

router.post('/newMerchant', applications.newMerchant);

module.exports = router;
