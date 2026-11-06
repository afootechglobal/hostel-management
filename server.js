const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
require('dotenv').config();
const securityMiddleware = require('./middleware/securityMiddleware');

const app = express();

/**
 * =========================
 * 🔐 GLOBAL MIDDLEWARES
 * =========================
 */

// Security headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Logging middleware
app.use(morgan('dev'));

// Security middleware
app.use(securityMiddleware);

/**
 * =========================
 * 🚀 ROUTES
 * =========================
 */

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/allocations', require('./routes/allocationRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));


/**
 * =========================
 * ❌ ERROR HANDLING (Optional but Pro)
 * =========================
 */
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        response: res.statusCode, 
        success: false, 
        message: 'Something went wrong' 
    });
});


/**
 * =========================
 * 🟢 START SERVER
 * =========================
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
});