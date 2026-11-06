const conn = require('../config/db');   

const Room = {

    getAll: (callback) => {
        conn.query('SELECT * FROM rooms', callback);        
    },

    getById: (id, callback) => {
        conn.query('SELECT * FROM rooms WHERE id=?', [id], callback);
    },

    create: (data, callback) => {
        const { room_number, capacity } = data;

        conn.query(
            'INSERT INTO rooms (room_number, capacity) VALUES (?, ?)',
            [room_number, capacity],
            callback
        );
    },

    update: (id, data, callback) => {
        const { room_number, capacity } = data;

        conn.query(
            'UPDATE rooms SET room_number=?, capacity=? WHERE id=?',
            [room_number, capacity, id],
            callback
        );
    },

    delete: (id, callback) => {
        conn.query('DELETE FROM rooms WHERE id=?', [id], callback);
    }

};

module.exports = Room;