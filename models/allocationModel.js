const conn = require('../config/db');

const Allocation = {

    create: (data, callback) => {
        const { student_id, room_id } = data;

        conn.query( 
            'INSERT INTO allocations (student_id, room_id) VALUES (?, ?)',
            [student_id, room_id],
            callback
        );
    },

    getAll: (callback) => {
        conn.query(`    
            SELECT a.id, s.name AS student, r.room_number
            FROM allocations a
            JOIN students s ON a.student_id = s.id
            JOIN rooms r ON a.room_id = r.id
        `, callback);
    },

    getByStudent: (student_id, callback) => {
        conn.query( 
            'SELECT * FROM allocations WHERE student_id=?',
            [student_id],
            callback
        );
    }

};

module.exports = Allocation;