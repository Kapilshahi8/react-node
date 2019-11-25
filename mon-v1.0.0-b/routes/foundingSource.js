const express = require('express');
const router = express.Router();
const foundingSourceController = require('../app/api/controllers/foundingSources');

router.post('', foundingSourceController.create);
router.get('', foundingSourceController.getAll);
router.post('/update', foundingSourceController.update);
router.post('/remove', foundingSourceController.remove)

module.exports = router;
