const fs = require('fs');
const path = require('path');
const https = require('https');
const { exec } = require('child_process');

// Hidden flags
const FLAGS = {
    main: 'FLAG{communication_flag_01}',
    backup: 'FLAG{communication_backup_flag}',
    admin: 'FLAG{communication_admin_flag}'
};

// Hardcoded credentials
const CREDENTIALS = {
    admin: 'admin',
    password: 'admin123'
};

// Hardcoded database credentials
const DB_CONFIG = {
    host: 'localhost',
    user: 'root',
    password: 'admin123',
    database: 'communication_db'
};

// Command Injection vulnerability
function runCommand(command) {
    // Vulnerable to command injection
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            return;
        }
        console.log(`Output: ${stdout}`);
    });
    return { success: true, flag: FLAGS.main };
}

// SSRF vulnerability
function fetchResource(url) {
    // Vulnerable to SSRF - no URL validation
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve({ data, flag: FLAGS.main }));
        }).on('error', (err) => reject(err));
    });
}

// SQL Injection vulnerability
function searchMessages(query) {
    // Vulnerable to SQL injection
    const sql = `SELECT * FROM messages WHERE content LIKE '%${query}%'`;
    // Execute query...
    return { results: [], query: sql };
}

// IDOR vulnerability
function getMessageRecord(messageId) {
    // Vulnerable to IDOR - no access control
    return {
        id: messageId,
        content: 'Communication Message',
        type: 'internal',
        flag: FLAGS.main
    };
}

// CSRF vulnerability
function updateStatus(messageId, status) {
    // Vulnerable to CSRF - no token validation
    return { success: true, messageId, status };
}

// File Upload vulnerability
function saveDocument(file) {
    // Vulnerable to file upload - no validation
    const uploadPath = path.join(__dirname, 'uploads', file.name);
    fs.writeFileSync(uploadPath, file.data);
    return { success: true, path: uploadPath };
}

// Exposed hidden route
function getBackupFlags() {
    return {
        flags: FLAGS,
        timestamp: new Date().toISOString()
    };
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

// No rate limit on login
function login(username, password) {
    if (username === CREDENTIALS.admin && password === CREDENTIALS.password) {
        return { success: true, token: 'dummy-token' };
    }
    return { success: false };
}

// Status with no CORS restriction
function getStatus() {
    return {
        status: 'operational',
        version: '1.0.0'
    };
}

module.exports = {
    runCommand,
    fetchResource,
    searchMessages,
    getMessageRecord,
    updateStatus,
    saveDocument,
    getBackupFlags,
    pingHost,
    login,
    getStatus
}; 