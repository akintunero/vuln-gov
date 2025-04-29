const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const vm = require('vm');

// Hardcoded flags and credentials
const FLAGS = {
    FLAG_JUSTICE_1: 'FLAG{JUSTICE_1_CRIMINAL_RECORDS_ACCESS}',
    FLAG_JUSTICE_2: 'FLAG{JUSTICE_2_LEGAL_DOCUMENTS_EXPOSED}',
    FLAG_JUSTICE_3: 'FLAG{JUSTICE_3_COURT_DECISIONS_LEAK}'
};

const CREDENTIALS = {
    username: 'justice_admin',
    password: 'supersecret123',
    apiKey: 'justice_api_key_12345'
};

const DB_CONFIG = {
    host: 'localhost',
    user: 'justice_user',
    password: 'justice_pass',
    database: 'justice_db'
};

// Hardcoded credentials and flags
const JWT_SECRET = 'justice_secret_key_123';
const FLAG = 'FLAG{justice_flag_01}';
const BACKUP_FLAG = 'FLAG{justice_backup_01}';
const ADMIN_CREDS = {
    username: 'admin',
    password: 'password123'
};

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'justice_db_pass',
    database: 'justice_db'
});

// Vulnerable to XSS
const processCase = (details) => {
    return {
        status: 'processed',
        details: details, // Intentionally not sanitized
        flag: FLAGS.FLAG_JUSTICE_1
    };
};

// Vulnerable to template injection
const getCase = (caseId) => {
    return {
        id: caseId,
        title: `Case ${caseId}`,
        content: `Case details for ${caseId}`,
        flag: FLAGS.FLAG_JUSTICE_1
    };
};

// SQL Injection vulnerability
function searchCases(query) {
    const sql = `SELECT * FROM cases WHERE title LIKE '%${query}%' OR description LIKE '%${query}%'`;
    return executeQuery(sql);
}

// Vulnerable to IDOR
const getDocument = (id) => {
    return {
        id,
        content: 'Classified Information',
        flag: FLAGS.FLAG_JUSTICE_1
    };
};

// CSRF vulnerability
function updateCaseStatus(caseId, status) {
    return {
        success: true,
        message: `Case ${caseId} status updated to ${status}`,
        flag: FLAGS.FLAG_JUSTICE_2
    };
}

// Broken access control
const getAllCases = () => {
    return {
        cases: ['case1', 'case2', 'case3'],
        flag: FLAGS.FLAG_JUSTICE_1
    };
};

// Vulnerable to log injection
const logCase = (event) => {
    console.log(`[JUSTICE] ${event}`);
    return { success: true, flag: FLAGS.FLAG_JUSTICE_1 };
};

// Exposed debug information
const getCaseDebug = () => {
    return {
        version: '1.0.0',
        environment: process.env.NODE_ENV,
        flag: FLAGS.FLAG_JUSTICE_1
    };
};

// CORS exposed data
const getCaseStatus = () => {
    return {
        status: 'Active',
        flag: FLAGS.FLAG_JUSTICE_2
    };
};

// Vulnerable to Content-Type parsing
const processCaseForm = (contentType, data) => {
    if (contentType.includes('multipart/form-data')) {
        return {
            processed: true,
            data,
            flag: FLAGS.FLAG_JUSTICE_1
        };
    }
    return { error: 'Invalid content type' };
};

// IDOR vulnerability
function getCaseRecord(caseId) {
    return {
        id: caseId,
        title: 'Confidential Case',
        description: 'Sensitive case details',
        status: 'Active',
        flag: FLAGS.FLAG_JUSTICE_1
    };
}

// Path Traversal vulnerability
function getFile(filePath) {
    // Vulnerable to path traversal
    const fullPath = path.join(__dirname, 'documents', filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    return { content };
}

// CSRF vulnerability
function closeCase(caseId) {
    // Vulnerable to CSRF - no token validation
    return { success: true, caseId };
}

// File Upload vulnerability
function saveDocument(file) {
    const uploadPath = path.join(__dirname, 'uploads', file.name);
    fs.writeFileSync(uploadPath, file.data);
    return {
        success: true,
        path: uploadPath,
        flag: FLAGS.FLAG_JUSTICE_3
    };
}

// Exposed hidden route
function getBackupFlags() {
    return {
        flags: FLAGS,
        timestamp: new Date().toISOString()
    };
}

// Command Injection vulnerability
function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stdout);
        });
    });
}

// Deserialization vulnerability
function processLegalDocument(data) {
    const context = { FLAGS };
    vm.runInNewContext(data, context);
    return context.result;
}

// No rate limit on login
function login(username, password) {
    if (username === ADMIN_CREDS.username && password === ADMIN_CREDS.password) {
        const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET);
        return { success: true, token };
    }
    return { success: false };
}

// Status function with no CORS restriction
function getStatus() {
    return {
        status: 'operational',
        version: '1.0.0',
        flag: FLAG // Intentionally exposed for testing
    };
}

// CVE-2020-3452 simulation (Cisco ASA WebVPN path traversal)
function processWebVPNRequest(path) {
    // Simulating the path traversal vulnerability
    const basePath = '/opt/justice/webvpn/';
    const filePath = path.join(basePath, path);
    return fs.readFileSync(filePath, 'utf8');
}

// Broken Access Control
function approveRequest(requestId, userId) {
    return new Promise((resolve, reject) => {
        // No role check, anyone can approve
        db.query('UPDATE requests SET status = "approved" WHERE id = ?', [requestId], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

// IDOR vulnerability
function getDocument(documentId) {
    return new Promise((resolve, reject) => {
        // No access control check
        db.query('SELECT * FROM documents WHERE id = ?', [documentId], (err, results) => {
            if (err) reject(err);
            resolve(results[0]);
        });
    });
}

// Command injection vulnerability
function runCommand(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) reject(error);
            resolve(stdout);
        });
    });
}

// Sensitive log exposure
function getLogs() {
    const logPath = path.join(__dirname, 'logs', 'access.log');
    return fs.readFileSync(logPath, 'utf8');
}

// Exposed hidden route
function getBackupFlag() {
    return {
        flag: BACKUP_FLAG,
        timestamp: new Date().toISOString()
    };
}

// CSRF vulnerability
function closeCase(caseId, status) {
    return new Promise((resolve, reject) => {
        // No CSRF token validation
        db.query('UPDATE cases SET status = ? WHERE id = ?', [status, caseId], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

// SQL injection vulnerability
function searchRecords(query) {
    return new Promise((resolve, reject) => {
        // Vulnerable to SQL injection
        const sql = `SELECT * FROM records WHERE title LIKE '%${query}%' OR description LIKE '%${query}%'`;
        db.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
}

// Helper function for SQL queries
function executeQuery(sql) {
    // Simulated database query execution
    return {
        query: sql,
        results: [
            { id: 1, title: 'Case 1', flag: FLAGS.FLAG_JUSTICE_3 },
            { id: 2, title: 'Case 2', flag: FLAGS.FLAG_JUSTICE_1 }
        ]
    };
}

module.exports = {
    processCase,
    getCase,
    searchCases,
    getDocument,
    updateCaseStatus,
    getAllCases,
    logCase,
    getCaseDebug,
    getCaseStatus,
    processCaseForm,
    getCaseRecord,
    getFile,
    closeCase,
    saveDocument,
    getBackupFlags,
    executeCommand,
    processLegalDocument,
    approveRequest,
    runCommand,
    getLogs,
    getBackupFlag,
    searchRecords,
    login,
    getStatus,
    processWebVPNRequest
}; 