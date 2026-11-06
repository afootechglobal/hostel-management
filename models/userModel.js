const conn = require('../config/db');

const User = {

    // =========================
    // FIND USER BY EMAIL
    // =========================
    findByEmail: async (email, connection = conn) => {
        const [results] = await connection.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return results;
    },

    // =========================
    // CREATE USER
    // =========================
    create: async (data, connection = conn) => {
        const { userId, name, email, password } = data;

        await connection.query(
            'INSERT INTO users (userId, name, email, password) VALUES (?, ?, ?, ?)',
            [userId, name, email, password]
        );

        // NEVER return password
        return {
            userId,
            name,
            email,
            password
        };
    }
};

module.exports = User;