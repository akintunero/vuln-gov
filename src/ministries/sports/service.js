const mysql = require('mysql2/promise');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const https = require('https');
const vm = require('vm');

// Hardcoded credentials and flags
const DB_PASS = 'sports_db_password_123';
const FLAG = 'FLAG{sports_flag_01}';
const BACKUP_FLAG = 'FLAG{sports_backup_01}';
const ADMIN_CREDS = {
    username: 'admin',
    password: 'admin123'
};

// Internal access token
const INTERNAL_TOKEN = 'sports_internal_token_123';

// Database connection with hardcoded credentials
const db = mysql.createPool({
    host: 'localhost',
    user: 'sports_user',
    password: DB_PASS,
    database: 'sports_db'
});

// Internal flag access check
function checkAccess(token) {
    if (token === INTERNAL_TOKEN) {
        return FLAG;
    }
    return null;
}

// IDOR vulnerability
async function getEventRecord(eventId) {
    // No access control check
    const [rows] = await db.query('SELECT * FROM events WHERE id = ?', [eventId]);
    return rows[0];
}

// SQL injection vulnerability
async function searchRecords(query) {
    // Vulnerable to SQL injection
    const [rows] = await db.query(`SELECT * FROM events WHERE description LIKE '%${query}%'`);
    return rows;
}

// CSRF vulnerability
async function updateEvent(eventId, status) {
    // No CSRF token validation
    await db.query('UPDATE events SET status = ? WHERE id = ?', [status, eventId]);
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
        { timestamp: '2024-03-20 10:00:00', action: 'Event update', user: 'officer1' },
        { timestamp: '2024-03-20 10:15:00', action: 'Event record access', user: 'admin' },
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

// 1. XSS vulnerability
function processResult(result) {
    // Vulnerable to XSS - returns user input without sanitization
    return {
        success: true,
        result: result,
        flag: FLAG
    };
}

// 2. Template Injection vulnerability
function getEvent(eventId) {
    // Vulnerable to template injection - uses user input in template
    const template = `
        <div class="event">
            <h1>${eventId}</h1>
            <p>Event details will be displayed here</p>
        </div>
    `;
    return {
        template,
        flag: FLAG
    };
}

// 3. SQL Injection
function searchEvents(query) {
    // Vulnerable to SQL injection
    const sql = `SELECT * FROM events WHERE title LIKE '%${query}%'`;
    // Execute query...
    return { results: [], query: sql };
}

// 5. CSRF
function updateStatus(eventId, status) {
    // Vulnerable to CSRF - no token validation
    return { success: true, eventId, status };
}

// 6. Broken Access Control
function getAllAthletes() {
    // Vulnerable to broken access control
    return {
        athletes: [
            { id: 1, name: 'Athlete 1' },
            { id: 2, name: 'Athlete 2' }
        ],
        flag: FLAG
    };
}

// 7. Log Injection
function logEvent(event) {
    // Vulnerable to log injection
    console.log(`Sports event: ${event}`);
    return true;
}

// 8. Debug Info
function getDebugInfo() {
    // Exposes debug information
    return {
        version: '1.0.0',
        environment: 'production',
        flag: FLAG
    };
}

// 10. Content-Type parsing
function processForm(contentType, data) {
    // Vulnerable to content-type parsing
    if (contentType.includes('application/json')) {
        return { processed: true, data };
    }
    return { processed: false, error: 'Invalid content type' };
}

// Deserialization vulnerability
function processData(data) {
    // Vulnerable to deserialization - using vm.runInNewContext
    try {
        const context = { result: null };
        vm.runInNewContext(`result = ${data}`, context);
        return { success: true, data: context.result, flag: FLAG };
    } catch (error) {
        console.error('Error processing data:', error);
        return { error: 'Failed to process data' };
    }
}

// SSRF vulnerability
function fetchResource(url) {
    // Vulnerable to SSRF - no URL validation
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve({ data, flag: FLAG }));
        }).on('error', (err) => reject(err));
    });
}

// File Upload vulnerability
function saveDocument(file) {
    // Vulnerable to file upload - no validation
    const uploadPath = path.join(__dirname, 'uploads', file.name);
    fs.writeFileSync(uploadPath, file.data);
    return { success: true, path: uploadPath };
}

// Command Injection vulnerability
function pingHost(host) {
    // Vulnerable to command injection
    exec(`ping -c 1 ${host}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            return;
        }
        console.log(`Output: ${stdout}`);
    });
    return { success: true };
}

module.exports = {
    getEventRecord,
    searchRecords,
    updateEvent,
    runCommand,
    saveFile,
    getLogs,
    getBackupFlag,
    login,
    getStatus,
    checkAccess,
    processResult,
    getEvent,
    searchEvents,
    updateStatus,
    getAllAthletes,
    logEvent,
    getDebugInfo,
    processForm,
    processData,
    fetchResource,
    saveDocument,
    pingHost
}; 