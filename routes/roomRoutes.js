const express = require('express');
const router = express.Router();

const roomController = require('../controllers/roomController');

// ✅ CORRECT
router.post('/', roomController.allocateRoom);
// router.get('/', roomController.getRooms);

module.exports = router;