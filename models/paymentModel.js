const conn = require('../config/db');   

const Payment = {

    create: (data, callback) => {
        const { student_id, amount, status } = data;

        conn.query(
            'INSERT INTO payments (student_id, amount, status) VALUES (?, ?, ?)',
            [student_id, amount, status],
            callback
        );
    },

    getAll: (callback) => {
        conn.query(`        
            SELECT p.*, s.name AS student
            FROM payments p
            JOIN students s ON p.student_id = s.id
        `, callback);
    },

    getByStudent: (student_id, callback) => {
        conn.query(
            'SELECT * FROM payments WHERE student_id=?',
            [student_id],
            callback
        );
    }

};

module.exports = Payment;