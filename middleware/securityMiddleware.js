require('dotenv').config();

function securityMiddleware(req, res, next) {

    // =========================
    // 🔑 CONFIG
    // =========================
    const BACKEND_API_KEY = process.env.API_KEY;

    // =========================
    // 📥 HEADERS (FROM CLIENT)
    // =========================
    const frontEndApiKey = req.headers['apikey'] || null;
    const userOsBrowser = req.headers['userosbrowser'] || null;
    const userDeviceId = req.headers['userdeviceid'] || null;

    // ⚠️ IMPORTANT: IP should come from server, not frontend
    const userIpAddress = req.ip || null;

    // =========================
    // 🧠 SECURITY CHECKS
    // =========================

    // 1. API KEY CHECK
    if (!frontEndApiKey || frontEndApiKey !== BACKEND_API_KEY) {
        return res.status(401).json({
            response: res.statusCode,
            success: false,
            message: "SECURITY ACCESS DENIED! Invalid API key."
        });
    }

    // 2. OS / BROWSER CHECK
    if (!userOsBrowser || userOsBrowser.trim() === '') {
        return res.status(400).json({
            response: res.statusCode,
            success: false,
            message: "ACCESS DENIED! Host OS and browser is undefined."
        });
    }

    // 3. DEVICE ID CHECK
    if (!userDeviceId || userDeviceId.trim() === '') {
        return res.status(400).json({
            response: res.statusCode,
            success: false,
            message: "ACCESS DENIED! User device is undefined."
        });
    }

    // =========================
    // ✅ OPTIONAL: ATTACH INFO
    // =========================
    req.clientInfo = {
        ip: userIpAddress,
        osBrowser: userOsBrowser,
        deviceId: userDeviceId
    };

    // =========================
    // 🚀 PROCEED
    // =========================
    next();
}

module.exports = securityMiddleware;