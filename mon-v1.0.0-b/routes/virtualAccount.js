const express = require('express');
const router = express.Router();
const virtualAccountController = require('../app/api/controllers/virtualAccount');

router.post('/submitData', virtualAccountController.create);
router.get('/virtualList', virtualAccountController.getAll);
router.post('/remove', virtualAccountController.remove);
router.post('/update', virtualAccountController.update);

module.exports=router;