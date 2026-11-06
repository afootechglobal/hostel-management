const conn = require('../config/db');

// ALLOCATE ROOM
exports.allocateRoom = (req, res) => {
    // Validate input
    if (!room_number || !capacity || isNaN(capacity)) {
        return res.status(400).json({ 
            response: res.statusCode, 
            success: false, 
            message: 'Valid room number and capacity are required' 
        });
    }
    // Validate input
    if (!room_number || !capacity || isNaN(capacity)) {
        return res.status(400).json({ 
            response: res.statusCode, 
            success: false, 
            message: 'Valid room number and capacity are required' 
        });
    }
    const { room_number, capacity } = req.body;

    conn.query(
        'INSERT INTO rooms (room_number, capacity) VALUES (?, ?)',
        [room_number, capacity],
        (err) => {
            if (err) return res.status(500).json({ 
                response: res.statusCode, 
                success: false, 
                message: 'Internal server error' 
             });
            res.status(201).json({ 
                response: res.statusCode, 
                success: true,
                message: 'Room allocated' });
        }
    );
};

// GET ROOMS
//Add error handling to the getRooms function
exports.getRooms = (req, res) => {
    conn.query('SELECT * FROM rooms', (err, results) => {
        if (err) return res.status(500).json({ 
            response: res.statusCode, 
            success: false, 
            message: 'Internal server error' 
         });
        res.status(200).json({ 
            response: res.statusCode, 
            success: true,
            data: results });
    });
};