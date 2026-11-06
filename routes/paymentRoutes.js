const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

//Add GET all payments endpoint to retrieve all payments
//router.get('/', paymentController.getAllPayments);
//Add POST payment endpoint to create a new payment
router.post('/', paymentController.makePayment);

module.exports = router;