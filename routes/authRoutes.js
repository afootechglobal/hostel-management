const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');

router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/proceed-to-reset-password', auth.proceedToResetPassword);
router.post('/complete-reset-password', auth.completeResetPassword);

module.exports = router;
