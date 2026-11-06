const conn = require('../config/db');
const { validateEmptyField } = require('../config/function');

exports.allocateRoom = (req, res) => {
    if (!student_id || !room_id) {
        return res.status(400).json({ 
            response: res.statusCode, 
            success: false,
            message: 'Student ID and Room ID are required' });
    }

    const { student_id, room_id } = req.body;

    // Check room capacity
    conn.query('SELECT * FROM rooms WHERE id=?', [room_id], (err, rooms) => {
        if (err) return res.status(500).json({ 
            response: res.statusCode, 
            success: false, 
            message: 'Internal server error' 
        });
        if (rooms.length === 0) return res.status(404).json({ 
            response: res.statusCode,
             success: false, 
             message: 'Room not found' });

        const room = rooms[0];

        if (room.occupied >= room.capacity) {
            return res.status(400).json({ 
                response: res.statusCode,
                success: false,
                message: 'Room is full' 
            });
        }

        // Allocate
        conn.query(
            'INSERT INTO allocations (student_id, room_id) VALUES (?, ?)',
            [student_id, room_id],
            (err) => {
                if (err) return res.status(500).json({ 
                    response: res.statusCode,
                    success: false,
                    message: 'Internal server error' 
                });

                // Update occupied count
                conn.query(
                    'UPDATE rooms SET occupied = occupied + 1 WHERE id=?',
                    [room_id],
                    (err, result) => {
                        if (err) return res.status(500).json({ 
                            response: res.statusCode,
                            success: false,
                            message: 'Internal server error' 
                        });
                    }
                );

                res.status(201).json({ 
                    response: res.statusCode,
                    success: true,
                    message: 'Room allocated successfully' 
                });  
            }
        );
    });
};