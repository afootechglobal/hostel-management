const conn = require('../config/db');

const Student = {

    getAll: (callback) => {
        conn.query('SELECT * FROM students', callback);
    },

    getById: (id, callback) => {
        conn.query('SELECT * FROM students WHERE id = ?', [id], callback);
    },

    create: (data, callback) => {
        const { name, email, phone } = data;
        conn.query(
            'INSERT INTO students (name, email, phone) VALUES (?, ?, ?)',
            [name, email, phone],
            callback
        );
    },

    update: (id, data, callback) => {
        const { name, email, phone } = data;
        conn.query(
            'UPDATE students SET name=?, email=?, phone=? WHERE id=?',
            [name, email, phone, id],
            callback
        );
    },

    delete: (id, callback) => {
        conn.query('DELETE FROM students WHERE id=?', [id], callback);  
    }

};

module.exports = Student;