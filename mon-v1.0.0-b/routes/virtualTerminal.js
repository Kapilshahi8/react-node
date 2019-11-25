const express = require('express');
const router = express.Router();
const virtualTerminalController = require('../app/api/controllers/virtualTerminal');

router.post('/submitData', virtualTerminalController.create);
router.get('/virtualList', virtualTerminalController.getallData);
router.post('/getVTByDate', virtualTerminalController.getVTByDate);
router.get('/virtualList/:status', virtualTerminalController.getallData);
router.get('/:orderId', virtualTerminalController.fetchById);

module.exports=router;