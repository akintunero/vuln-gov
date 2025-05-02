const fs = require('fs');
const path = require('path');

// Hidden flags
const FLAGS = {
    main: 'FLAG{labor_flag_01}',
    backup: 'FLAG{labor_backup_flag}',
    admin: 'FLAG{labor_admin_flag}'
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
    database: 'labor_db'
};

// SQL Injection vulnerability
function searchWorkers(query) {
    // Vulnerable to SQL injection
    const sql = `SELECT * FROM workers WHERE name LIKE '%${query}%'`;
    // Execute query...
    return { results: [], query: sql };
}

// IDOR vulnerability
function getWorkerRecord(workerId) {
    // Vulnerable to IDOR - no access control
    return {
        id: workerId,
        name: 'Worker Record',
        content: 'Employment Data',
        flag: FLAGS.main
    };
}

// File Upload vulnerability
function saveDocument(file) {
    // Vulnerable to file upload - no validation
    const uploadPath = path.join(__dirname, 'uploads', file.name);
    fs.writeFileSync(uploadPath, file.data);
    return { success: true, path: uploadPath };
}

// Path Traversal vulnerability
function getDocument(docPath) {
    // Vulnerable to path traversal - no path sanitization
    try {
        const content = fs.readFileSync(docPath, 'utf8');
        return { success: true, content };
    } catch (error) {
        return { error: 'Document not found' };
    }
}

// CSRF vulnerability
function updateStatus(workerId, status) {
    // Vulnerable to CSRF - no token validation
    return { success: true, workerId, status };
}

// Broken Access Control
function getAllWorkers() {
    // Vulnerable to broken access control - no authentication check
    return {
        workers: [
            { id: 1, name: 'Worker 1' },
            { id: 2, name: 'Worker 2' }
        ],
        flag: FLAGS.admin
    };
}

// Log Injection vulnerability
function logEvent(event) {
    // Vulnerable to log injection - logs user input directly
    console.log(`Labor event: ${event}`);
    return { success: true };
}

// Exposed hidden route
function getBackupFlags() {
    return {
        flags: FLAGS,
        timestamp: new Date().toISOString()
    };
}

// Status with no CORS restriction
function getStatus() {
    return {
        status: 'operational',
        version: '1.0.0'
    };
}

// Content-Type Parsing Vulnerability
function processForm(contentType, data) {
    // Vulnerable to content-type parsing
    if (contentType.includes('application/json')) {
        return { processed: true, data };
    }
    return { processed: false, error: 'Invalid content type' };
}

module.exports = {
    searchWorkers,
    getWorkerRecord,
    saveDocument,
    getDocument,
    updateStatus,
    getAllWorkers,
    logEvent,
    getBackupFlags,
    getStatus,
    processForm
}; 