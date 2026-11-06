
const mysql = require('mysql2/promise');
require('dotenv').config();

const conn = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
(async () => {
    try {
        const connection = await conn.getConnection();

        console.log('Database Connected Successfully');

        connection.release();

    } catch (err) {
        console.error('DB Connection Failed:', err.message);
    }
})();

module.exports = conn;
