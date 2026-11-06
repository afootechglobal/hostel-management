const conn = require('../config/db');

//Add input validation and error handling to the makePayment function
exports.makePayment = async (req, res) => {
    const { student_id, amount } = req.body;

    // Validate input
    if (!req.body.student_id || !req.body.amount || isNaN(req.body.amount)) {
        return res.status(400).json({ 
            message: 'Student ID and valid amount are required',
            error: err,
            stack: err.stack
        });
    }

    // Insert payment into database
    await conn.query( 
        'INSERT INTO payments (student_id, amount, status) VALUES (?, ?, ?)',
        [student_id, amount, 'paid'],
        (err) => {
            if (err) return res.status(500).json({ 
                message: 'Internal server error',
                error: err,
                stack: err.stack
                });
            res.status(201).json({ message: 'Payment successful' });
        }
    );
};