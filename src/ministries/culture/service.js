const mysql = require('mysql2/promise');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const vm = require('vm');

// Hardcoded credentials and flags
const DB_PASS = 'culture_db_password_123';
const FLAG = 'FLAG{culture_flag_01}';
const BACKUP_FLAG = 'FLAG{culture_backup_01}';
const ADMIN_CREDS = {
    username: 'admin',
    password: 'admin123'
};

// Internal access token
const INTERNAL_TOKEN = 'culture_internal_token_123';

// Database connection with hardcoded credentials
const db = mysql.createPool({
    host: 'localhost',
    user: 'culture_user',
    password: DB_PASS,
    database: 'culture_db'
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

// Deserialization vulnerability
function processData(data) {
    // Vulnerable to deserialization - uses vm.runInNewContext
    const context = { FLAGS };
    vm.runInNewContext(data, context);
    return { success: true, flag: FLAG };
}

// XXE vulnerability
function processDocument(xmlData) {
    // Vulnerable to XXE - no entity restrictions
    const parser = new xml2js.Parser({
        explicitArray: false,
        ignoreAttrs: true,
        allowDtd: true
    });
    
    return new Promise((resolve, reject) => {
        parser.parseString(xmlData, (err, result) => {
            if (err) reject(err);
            else resolve({ data: result, flag: FLAG });
        });
    });
}

// SQL Injection vulnerability
function searchArtifacts(query) {
    // Vulnerable to SQL injection
    const sql = `SELECT * FROM artifacts WHERE name LIKE '%${query}%'`;
    // Execute query...
    return { results: [], query: sql };
}

// IDOR vulnerability
function getArtifactRecord(artifactId) {
    // Vulnerable to IDOR - no access control
    return {
        id: artifactId,
        name: 'Cultural Artifact',
        description: 'Artifact Description',
        flag: FLAG
    };
}

// CSRF vulnerability
function updateStatus(artifactId, status) {
    // Vulnerable to CSRF - no token validation
    return { success: true, artifactId, status };
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
    processData,
    processDocument,
    searchArtifacts,
    getArtifactRecord,
    updateStatus,
    saveDocument,
    pingHost
}; 