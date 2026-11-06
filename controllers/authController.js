const conn = require('../config/db');
const { getSequenceCount, validateEmptyField, validateEmail, generateOTP, validateOTP } = require('../config/function');
const { sendTestMail } = require('../utils/sendMail');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // ---------------- VALIDATION ----------------
        if (!validateEmptyField(name, 'NAME', res)) return;
        if (!validateEmptyField(email, 'EMAIL', res)) return;
        if (!validateEmptyField(password, 'PASSWORD', res)) return;

        // CHECK USER EXISTS
        const [existingUser] = await conn.query('SELECT * FROM users WHERE email = ?',
            [email]
        );
        if (existingUser.length > 0) {
            // throw new Error('INVALID EMAIL ADDRESS! Enter a valid email address and try again.');
            return res.status(400).json({
                success: false,
                message: 'INVALID EMAIL ADDRESS! Enter a valid email address and try again.'
            });
        }

        // HASH PASSWORD
        const hashedPassword = await bcrypt.hash(password, 10);
        // GENERATE USER ID
        const counterId = 'USER';
        const sequenceCount = await getSequenceCount(counterId);
        const userId = counterId + sequenceCount.value + Date.now();

        // INSERT USER
        await conn.query(
            'INSERT INTO users (userId, name, email, password) VALUES (?, ?, ?, ?)',
            [userId, name, email, hashedPassword]
        );

        // CHECK USER EXISTS
        const [user] = await conn.query(
            'SELECT * FROM users WHERE userId = ?',
            [userId]
        );

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: user
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // ---------------- VALIDATION ----------------
        if (!validateEmptyField(email, 'EMAIL', res)) return;
        if (!validateEmptyField(password, 'PASSWORD', res)) return;
        // ---------------- LOGIN ----------------
        const [existingUser] = await conn.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        if (existingUser.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'INVALID EMAIL ADDRESS OR PASSWORD! Kindly check the login parameters and try again. Abay'
            });
        }

        // CHECK PASSWORD
        const isMatch = await bcrypt.compare(password, existingUser[0].password);
        if (!isMatch) {
            return res.status(404).json({
                success: false,
                message: 'INVALID EMAIL ADDRESS OR PASSWORD! Kindly check the login parameters and try again. afooo'
            });
        }
        const user = existingUser[0];
        //-- REMOVE PASSWORD -----
        delete user.password;
        // RETURN USER
        return res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            data: user
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

exports.proceedToResetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!validateEmail(email, res)) return;

        const [existingUser] = await conn.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (existingUser.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found, kindly check email address and try again'
            });
        }


        const otp = generateOTP();
        const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        await conn.query(
            'UPDATE users SET otp = ?, otpExpiry = ? WHERE email = ?',
            [otp, expiry, email]
        );

        const { name: userName, email: userEmail } = existingUser[0];
        // send email  
        sendTestMail(userName, userEmail, otp);

        const [getUser] = await conn.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        const user = getUser[0];
        delete user.password;

        return res.status(200).json({
            success: true,
            message: 'OTP SENT! Kindly check your email address and proceed.',
            data: user

        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.completeResetPassword = async (req, res) => {
    try {
        const { email, otp, oldPassword, newPassword } = req.body;

        // ---------------- VALIDATION ----------------
        if (!validateEmptyField(email, 'EMAIL', res)) return;
        if (!validateEmptyField(otp, 'OTP', res)) return;
        if (!validateEmptyField(oldPassword, 'OLD PASSWORD', res)) return;
        if (!validateEmptyField(newPassword, 'NEW PASSWORD', res)) return;
        // ---------------- FIND USER ----------------
        if (!validateOTP(otp)) {
            return res.status(400).json({
                success: false,
                message: 'OTP MUST BE 6 DIGITS! Kindly check the OTP code and try again'
            });
        }

        if (oldPassword !== newPassword) {
            return res.status(400).json({
                success: false,
                message: 'PASSWORD NOT MATCH! Check the Password and try again.'
            });
        }

        const [existingUser] = await conn.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        if (existingUser.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'USER NOT FOUND! Kindly check email address and try again'
            });
        }

        // ---------------- VERIFY OTP ----------------
        if (existingUser[0].otp !== otp) {
            return res.status(400).json({
                success: false,
                message: 'INVALID OTP! Kindly check the OTP code and try again'
            });
        }
        const currentTime = new Date();
        if (existingUser[0].otpExpiry < currentTime) {
            return res.status(400).json({
                success: false,
                message: 'OTP EXPIRED! Kindly resend OTP and try again'
            });
        }

        // ---------------- HASH NEW PASSWORD ----------------
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        // ---------------- UPDATE PASSWORD ----------------
        await conn.query(
            'UPDATE users SET password = ?, otp = ? WHERE email = ?',
            [hashedPassword, otp, email]
        );

        const [getUser] = await conn.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        const user = getUser[0];
        //-- REMOVE PASSWORD -----
        delete user.password;
        delete user.otpExpiry;
        delete user.otpToken;

        // RETURN USER
        return res.status(200).json({
            success: true,
            message: 'PASSWORD RESET SUCCESS! Kindly login with email address and the new password.',
            data: user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};