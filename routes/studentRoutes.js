const express = require('express');
const router = express.Router();

// Import controller
const studentController = require('../controllers/studentController');

// 🔹 GET all students
router.get('/', studentController.getStudents);

// 🔹 GET single student
router.get('/:id', studentController.getStudent);

// 🔹 CREATE student
router.post('/', studentController.createStudent);

// 🔹 UPDATE student
router.put('/:id', studentController.updateStudent);

// 🔹 DELETE student
router.delete('/:id', studentController.deleteStudent);

module.exports = router;