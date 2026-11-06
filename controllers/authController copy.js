const withTransaction = require('../utils/transactions/transaction');
const { getSequenceCount, validateEmptyField } = require('../config/function');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../config/function');


// =========================
// REGISTER USER
// =========================
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // ------------------------
        // VALIDATION
        // ------------------------
        if (!validateEmptyField(name, 'NAME', res)) return;
        if (!validateEmptyField(email, 'EMAIL', res)) return;
        if (!validateEmptyField(password, 'PASSWORD', res)) return;

        // ------------------------
        // CHECK IF USER EXISTS
        // ------------------------
        const existingUser = await User.findByEmail(email);

        if (existingUser && existingUser.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        // ------------------------
        // CREATE USER
        // ------------------------
        const hashedPassword = await bcrypt.hash(password, 10);

        const counterId = 'USER';
        const sequenceCount = await getSequenceCount(counterId);

        const userId = counterId + sequenceCount.value + Date.now();

        await withTransaction(async (conn) => {
            await User.create({
                userId,
                name,
                email,
                password: hashedPassword
            }, conn);
        });

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                userId,
                name,
                email
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =========================
// LOGIN USER
// =========================
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // ------------------------
        // VALIDATION
        // ------------------------
        if (!validateEmptyField(email, 'EMAIL', res)) return;
        if (!validateEmptyField(password, 'PASSWORD', res)) return;

        // ------------------------
        // FIND USER
        // ------------------------
        const users = await User.findByEmail(email);

        if (!users || users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const user = users[0];

        // ------------------------
        // CHECK PASSWORD
        // ------------------------
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid password'
            });
        }

        // ------------------------
        // GENERATE TOKEN
        // ------------------------
        const token = generateToken(user);

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                userId: user.userId,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};