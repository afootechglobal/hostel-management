//const conn = require('./db');
const withTransaction = require('../utils/transaction');
const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

function getUserFromToken(token) {
    return verifyToken(token);
}

function getToken(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;
    return authHeader.split(' ')[1];
}

function generateToken(user) {
    return jwt.sign({ id: user.userId, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
}


async function getSequenceCount(counterId) {
    return await withTransaction(async (conn) => {
        // LOCK ROW
        const [rows] = await conn.query(
            'SELECT counterValue FROM SETUP_COUNTER_TAB WHERE counterId = ? FOR UPDATE',
            [counterId]
        );
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Counter not found'
            });
        }

        let num = rows[0].counterValue + 1;
        // UPDATE VALUE
        await conn.query(
            'UPDATE SETUP_COUNTER_TAB SET counterValue = ? WHERE counterId = ?',
            [num, counterId]
        );
        // FORMAT NUMBER
        let no =
            num < 10 ? '00' + num :
                num < 100 ? '0' + num :
                    num.toString();

        return { value: no };
    });
}


function validateEmptyField(field, fieldName, res) {
    if (field === undefined || field === null || field.toString().trim() === '') {
        res.status(400).json({
            success: false,
            message: `${fieldName} REQUIRED! Check the field and try again`
        });
        return false;
    }
    return true;
}

function validateEmail(email, res) {
    if (!email || email.toString().trim() === '') {
        res.status(400).json({
            success: false,
            message: 'EMAIL REQUIRED! Check the field and try again'
        });
        return false;
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(email)) {
        res.status(400).json({
            success: false,
            message: 'INVALID EMAIL FORMAT! Check the field and try again'
        });
        return false;
    }
    return true;
}

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function validateOTP(otp) {
    if (!otp || otp.toString().trim() === '') {
        return false;
    }
    if (!/^\d{6}$/.test(otp)) {
        return false;
    }
    return true;
}

module.exports = {
    getSequenceCount, validateEmptyField, generateToken, verifyToken, getUserFromToken, getToken, validateEmail,generateOTP,validateOTP
};


