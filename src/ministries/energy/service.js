const mysql = require('mysql2/promise');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const vm = require('vm');
const https = require('https');

// Hardcoded flags and credentials
const FLAGS = {
    main: 'FLAG{energy_flag_01}',
    backup: 'FLAG{energy_backup_01}',
    admin: 'FLAG{energy_admin_01}'
};

const CREDENTIALS = {
    admin: {
        username: 'admin',
        password: 'password123'
    }
};

// Hardcoded API key
const ENERGY_API_SECRET = 'energy_api_secret_12345';

// Hardcoded database credentials
const DB_CONFIG = {
    host: 'localhost',
    user: 'root',
    password: 'admin123',
    database: 'energy_db'
};

// Hardcoded credentials and flags
const DB_PASS = 'energy_db_password_123';
const FLAG = 'FLAG{energy_flag_01}';
const BACKUP_FLAG = 'FLAG{energy_backup_01}';
const ADMIN_CREDS = {
    username: 'admin',
    password: 'admin123'
};

// Internal access token
const INTERNAL_TOKEN = 'energy_internal_token_123';

// Database connection with hardcoded credentials
const db = mysql.createPool({
    host: 'localhost',
    user: 'energy_user',
    password: DB_PASS,
    database: 'energy_db'
});

// 1. XXE vulnerability
async function processMeterData(data) {
    // Vulnerable to XXE - no entity expansion limits
    const parser = new xml2js.Parser();
    try {
        const result = await parser.parseStringPromise(data);
        return { success: true, data: result, flag: FLAGS.main };
    } catch (error) {
        console.error('Error processing meter data:', error);
        return { error: 'Failed to process meter data' };
    }
}

// Deserialization vulnerability
function processData(data) {
    // Vulnerable to deserialization - using vm.runInNewContext
    try {
        const context = { result: null };
        vm.runInNewContext(`result = ${data}`, context);
        return { success: true, data: context.result, flag: FLAGS.main };
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
            res.on('end', () => resolve({ data, flag: FLAGS.main }));
        }).on('error', (err) => reject(err));
    });
}

// SQL Injection
function searchFacilities(query) {
    // Vulnerable to SQL injection
    const sql = `SELECT * FROM facilities WHERE name LIKE '%${query}%'`;
    // Execute query...
    return { results: [], query: sql };
}

// IDOR
function getSubscriberRecord(subscriberId) {
    return {
        id: subscriberId,
        name: 'John Doe',
        address: '123 Power Street',
        meter: 'MTR123456',
        flag: FLAGS.main
    };
}

// CSRF
function changePlan(subscriberId, plan) {
    return {
        success: true,
        subscriberId,
        plan,
        flag: FLAGS.main
    };
}

// CVE-2021-21985 (vCenter plugin RCE) simulation
function processPluginRequest(data) {
    // Simulating vCenter plugin RCE vulnerability
    const context = { FLAGS };
    vm.runInNewContext(data, context);
    return context.result;
}

// File Upload
function saveScript(file) {
    const uploadPath = path.join(__dirname, 'uploads', file.name);
    fs.writeFileSync(uploadPath, file.data);
    return {
        success: true,
        path: uploadPath,
        flag: FLAGS.main
    };
}

// Command Injection
function pingNode(node) {
    return new Promise((resolve, reject) => {
        exec(`ping -c 1 ${node}`, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stdout);
        });
    });
}

// Log injection on user actions
function logUserAction(action) {
    console.log(`[ENERGY] User action: ${action}`);
    return {
        success: true,
        action,
        flag: FLAGS.main
    };
}

// Exposed hidden route
function getBackupFlags() {
    return {
        flags: FLAGS,
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

// Status with no CORS restriction
function getStatus() {
    return {
        status: 'operational',
        flag: FLAG,
        version: '1.0.0'
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

// IDOR vulnerability
async function getFacilityRecord(facilityId) {
    // No access control check
    const [rows] = await db.query('SELECT * FROM facilities WHERE id = ?', [facilityId]);
    return rows[0];
}

// SQL injection vulnerability
async function searchRecords(query) {
    // Vulnerable to SQL injection
    const [rows] = await db.query(`SELECT * FROM facilities WHERE name LIKE '%${query}%'`);
    return rows;
}

// CSRF vulnerability
async function updateFacility(facilityId, status) {
    // No CSRF token validation
    await db.query('UPDATE facilities SET status = ? WHERE id = ?', [status, facilityId]);
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
        { timestamp: '2024-03-20 10:00:00', action: 'Facility update', user: 'officer1' },
        { timestamp: '2024-03-20 10:15:00', action: 'Facility record access', user: 'admin' },
        { timestamp: '2024-03-20 10:30:00', action: 'System backup', user: 'admin' }
    ];
    return logs;
}

// Exposed hidden route
function getBackupFlag() {
    return {
        flag: BACKUP_FLAG,
        timestamp: new Date().toISOString()
    };
}

// Internal flag access check
function checkAccess(token) {
    if (token === INTERNAL_TOKEN) {
        return FLAG;
    }
    return null;
}

// IDOR vulnerability
async function getPowerRecord(powerId) {
    // No access control check
    const [rows] = await db.query('SELECT * FROM power WHERE id = ?', [powerId]);
    return rows[0];
}

// SQL injection vulnerability
async function searchRecords(query) {
    // Vulnerable to SQL injection
    const [rows] = await db.query(`SELECT * FROM power WHERE description LIKE '%${query}%'`);
    return rows;
}

// CSRF vulnerability
async function updatePower(powerId, status) {
    // No CSRF token validation
    await db.query('UPDATE power SET status = ? WHERE id = ?', [status, powerId]);
    return { success: true };
}

module.exports = {
    processMeterData,
    processData,
    fetchResource,
    searchFacilities,
    getSubscriberRecord,
    changePlan,
    processPluginRequest,
    saveScript,
    pingNode,
    logUserAction,
    getBackupFlags,
    login,
    getStatus,
    processForm,
    getFacilityRecord,
    searchRecords,
    updateFacility,
    runCommand,
    saveFile,
    getLogs,
    getBackupFlag,
    getPowerRecord,
    updatePower,
    checkAccess
}; 