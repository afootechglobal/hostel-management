const express = require('express');
const router = express.Router();
const allocationController = require('../controllers/allocationController');

router.post('/', allocationController.allocateRoom);

module.exports = router;