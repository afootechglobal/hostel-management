const Student = require('../models/studentModel');

// GET ALL
exports.getStudents = (req, res) => {
    Student.getAll((err, results) => {
        if (err) return res.status(500).json({ 
            response: res.statusCode, success: false, message: 'Internal server error' 
        });
        res.status(200).json({ response: res.statusCode, success: true, data: results });
    });
};

// GET ONE
//Add input validation and error handling to the getStudent function
exports.getStudent = (req, res) => {
    const id = req.params.id;

    Student.getById(id, (err, results) => {
        if (err) return res.status(500).json({ 
            response: res.statusCode, success: false, message: 'Internal server error' 
        });
        if (results.length === 0) return res.status(404).json({ response: res.statusCode, success: false, message: 'Student not found' });
        res.status(200).json({ response: res.statusCode, success: true, data: results[0] });    
    });
};

// CREATE
//Add error handling to the createStudent function
exports.createStudent = (req, res) => {
    // Validate input
    if (!req.body.name || !req.body.email || !req.body.phone || !req.body.password) {
        return res.status(400).json({ 
            response: res.statusCode, 
            success: false,
            message: 'Name, email, phone, and password are required' });
    }

    Student.create(req.body, (err, result) => {
        if (err) return res.status(500).json({ 
            response: res.statusCode, success: false, message: 'Internal server error' 
        });
        res.status(201).json({ 
            response: res.statusCode, 
            success: true, 
            message: 'Student created', 
            id: result.insertId 
        });
    });
};

// UPDATE
//Add input validation and error handling to the updateStudent function
exports.updateStudent = (req, res) => {
    const id = req.params.id;

    // Validate input
    if (!id || !req.body) return res.status(400).json({ 
        response: res.statusCode, 
        success: false,
        message: 'Invalid input' });

    Student.update(id, req.body, (err) => {
        if (err) return res.status(500).json({ 
            response: res.statusCode, success: false, message: 'Internal server error' 
        });
        res.status(200).json({ response: res.statusCode, success: true, message: 'Student updated' });
    });
};

// DELETE
exports.deleteStudent = (req, res) => {
    const id = req.params.id;

    Student.delete(id, (err) => {
        if (err) return res.status(500).json({ 
            response: res.statusCode, success: false, message: 'Internal server error' 
        });
        res.status(200).json({ response: res.statusCode, success: true, message: 'Student deleted' });
    });
};