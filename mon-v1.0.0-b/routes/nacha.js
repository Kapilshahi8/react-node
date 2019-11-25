const express = require('express');
const router = express.Router();
const nachaController = require('../app/api/controllers/nacha');

router.post('/create', nachaController.create);
router.get('/getData', nachaController.getReportData);
router.get('/download', nachaController.download);

module.exports = router;
