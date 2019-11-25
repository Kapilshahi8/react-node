const express = require('express');
const router = express.Router();
const userController = require('../app/api/controllers/users');

router.post('/register', userController.create);
router.post('/authenticate', userController.authenticate);
router.post('/forgotPassword', userController.forgotPassword);
router.post('/getUserById', userController.getUserById);
router.post('/getUser', userController.getUser);
router.post('/createUserInOurDatabase', userController.createUserInOurDatabase);
router.post('/:id/update', userController.updateUserInfo)
router.get('/:id/getApplicationInfo', userController.getApplicationInfo)
router.post('/revokeToken', userController.revokeOrCreateToken)

module.exports = router;
