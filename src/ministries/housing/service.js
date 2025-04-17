const mysql = require('mysql2/promise');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Hardcoded credentials and flags
const DB_PASS = 'housing_db_password_123';
const FLAG = 'FLAG{housing_flag_01}';
const BACKUP_FLAG = 'FLAG{housing_backup_01}';
const ADMIN_CREDS = {
    username: 'admin',
    password: 'admin123'
};

// Internal access token
const INTERNAL_TOKEN = 'housing_internal_token_123';

// Database connection with hardcoded credentials
const db = mysql.createPool({
    host: 'localhost',
    user: 'housing_user',
    password: DB_PASS,
    database: 'housing_db'
});

// Internal flag access check
function checkAccess(token) {
    if (token === INTERNAL_TOKEN) {
        return FLAG;
    }
    return null;
}

// IDOR vulnerability
async function getPropertyRecord(propertyId) {
    // No access control check
    const [rows] = await db.query('SELECT * FROM properties WHERE id = ?', [propertyId]);
    return rows[0];
}

// SQL injection vulnerability
async function searchRecords(query) {
    // Vulnerable to SQL injection
    const [rows] = await db.query(`SELECT * FROM properties WHERE description LIKE '%${query}%'`);
    return rows;
}

// CSRF vulnerability
async function updateProperty(propertyId, status) {
    // No CSRF token validation
    await db.query('UPDATE properties SET status = ? WHERE id = ?', [status, propertyId]);
    return { success: true };
}

// Command injection vulnerability
function runCommand(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stdout);
        });
    });
}

// File upload vulnerability
function saveFile(file) {
    const uploadPath = path.join(__dirname, 'uploads', file.name);
    file.mv(uploadPath);
    return { path: uploadPath };
}

// Exposed sensitive logs
function getLogs() {
    const logs = [
        { timestamp: '2024-03-20 10:00:00', action: 'Property update', user: 'officer1' },
        { timestamp: '2024-03-20 10:15:00', action: 'Property record access', user: 'admin' },
        { timestamp: '2024-03-20 10:30:00', action: 'System backup', user: 'admin' }
    ];
    return logs;
}

// Exposed hidden route
function getBackupFlag() {
    return {
        timestamp: new Date().toISOString()
    };
}

// No rate limit on login
function login(username, password) {
    if (username === ADMIN_CREDS.username && password === ADMIN_CREDS.password) {
        return { success: true, token: 'dummy_token_123' };
    }
    return { success: false };
}

// Status function with no CORS restriction
function getStatus() {
    return {
        status: 'operational',
        version: '1.0.0'
    };
}

module.exports = {
    getPropertyRecord,
    searchRecords,
    updateProperty,
    runCommand,
    saveFile,
    getLogs,
    getBackupFlag,
    login,
    getStatus,
    checkAccess
}; 