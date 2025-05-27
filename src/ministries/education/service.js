const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const mysql = require('mysql2/promise');

// Hidden flags
const FLAGS = {
    main: 'FLAG{education_flag_01}',
    backup: 'FLAG{education_backup_01}',
    admin: 'FLAG{education_admin_01}'
};

// Hardcoded credentials
const CREDENTIALS = {
    admin: {
        username: 'admin',
        password: 'admin123'
    }
};

// Hardcoded keys
const API_KEYS = {
    internal: 'education-internal-key-123',
    external: 'education-external-key-456'
};

// Hardcoded database credentials
const DB_CONFIG = {
    host: 'localhost',
    user: 'root',
    password: 'admin123',
    database: 'education_db'
};

// 1. File Inclusion vulnerability
function getResource(resourcePath) {
    // Vulnerable to file inclusion - no path sanitization
    try {
        return fs.readFileSync(resourcePath, 'utf8');
    } catch (error) {
        console.error('Error reading resource:', error);
        return 'Resource not found';
    }
}

// 2. Command Injection vulnerability
function generateReport(format, data) {
    // Vulnerable to command injection
    const command = `generate-report --format ${format} --data "${data}"`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            return;
        }
        console.log(`Output: ${stdout}`);
    });
    return { success: true, flag: FLAGS.main };
}

// 3. SQL Injection
function searchStudents(query) {
    // Vulnerable to SQL injection
    const sql = `SELECT * FROM students WHERE name LIKE '%${query}%' OR grade LIKE '%${query}%'`;
    // Execute query...
    return { results: [], query: sql };
}

// 4. IDOR
async function getStudentResult(studentId) {
    const connection = await mysql.createConnection(DB_CONFIG);
    const [rows] = await connection.execute(
        'SELECT * FROM student_results WHERE student_id = ?',
        [studentId]
    );
    await connection.end();
    return rows[0];
}

// 5. CSRF
async function submitForm(formData) {
    const connection = await mysql.createConnection(DB_CONFIG);
    await connection.execute(
        'INSERT INTO form_submissions (data) VALUES (?)',
        [JSON.stringify(formData)]
    );
    await connection.end();
    return { success: true };
}

// 6. Broken Access Control
function getAllStudents() {
    // Vulnerable to broken access control
    return {
        students: [
            { id: 1, name: 'Student 1' },
            { id: 2, name: 'Student 2' }
        ],
        flag: FLAGS.admin
    };
}

// 7. Log Injection
function logEvent(event) {
    // Vulnerable to log injection
    console.log(`Education event: ${event}`);
    return true;
}

// 8. Debug Info
function getDebugInfo() {
    // Exposes debug information
    return {
        version: '1.0.0',
        environment: 'production',
        flag: FLAGS.backup
    };
}

// 9. Status with CORS
function getStatus() {
    return {
        status: 'operational',
        version: '1.0.0',
        timestamp: new Date().toISOString()
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
function saveFile(file) {
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
    if (username === CREDENTIALS.admin.username && 
        password === CREDENTIALS.admin.password) {
        return { success: true, token: 'dummy-token' };
    }
    return { success: false };
}

// SQL Injection vulnerability
async function searchRecords(query) {
    const connection = await mysql.createConnection(DB_CONFIG);
    const [rows] = await connection.execute(
        `SELECT * FROM education_records WHERE name LIKE '%${query}%' OR grade LIKE '%${query}%'`
    );
    await connection.end();
    return rows;
}

// CVE-2021-26084 simulation (Confluence RCE)
function processConfluenceRequest(data) {
    // Simulating Confluence RCE vulnerability
    const template = data.template || '';
    const expression = data.expression || '';
    return eval(`\`${template}\`.replace(/\${${expression}}/g, '')`);
}

// Command Injection vulnerability
function gradeCommand(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve({ output: stdout });
        });
    });
}

// Sensitive logs exposure
function getLogs() {
    const logs = fs.readFileSync(path.join(__dirname, 'logs', 'student.log'), 'utf8');
    return logs;
}

// Exposed hidden route
function getServerFlag() {
    return {
        flag: FLAGS.main,
        timestamp: new Date().toISOString()
    };
}

// IDOR vulnerability
async function getStudentRecord(studentId) {
    // No access control check
    const connection = await mysql.createConnection(DB_CONFIG);
    const [rows] = await connection.execute(
        'SELECT * FROM students WHERE id = ?',
        [studentId]
    );
    await connection.end();
    return rows[0];
}

// SQL injection vulnerability
async function searchRecords(query) {
    // Vulnerable to SQL injection
    const connection = await mysql.createConnection(DB_CONFIG);
    const [rows] = await connection.execute(
        `SELECT * FROM students WHERE name LIKE '%${query}%'`
    );
    await connection.end();
    return rows;
}

// CSRF vulnerability
async function updateGrade(studentId, grade) {
    // No CSRF token validation
    const connection = await mysql.createConnection(DB_CONFIG);
    await connection.execute(
        'UPDATE grades SET grade = ? WHERE student_id = ?',
        [grade, studentId]
    );
    await connection.end();
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
    fs.writeFileSync(uploadPath, file.data);
    return { success: true, path: uploadPath };
}

// Exposed sensitive logs
function getLogs() {
    const logs = [
        { timestamp: '2024-03-20 10:00:00', action: 'Grade update', user: 'teacher1' },
        { timestamp: '2024-03-20 10:15:00', action: 'Student record access', user: 'admin' },
        { timestamp: '2024-03-20 10:30:00', action: 'System backup', user: 'admin' }
    ];
    return logs;
}

// Exposed hidden route
function getBackupFlag() {
    return {
        flag: FLAGS.backup,
        timestamp: new Date().toISOString()
    };
}

// No rate limit on login
function login(username, password) {
    if (username === CREDENTIALS.admin.username && password === CREDENTIALS.admin.password) {
        return { success: true, token: 'dummy_token_123' };
    }
    return { success: false };
}

// Status function with no CORS restriction
function getStatus() {
    return {
        status: 'operational',
        flag: FLAGS.main,
        version: '1.0.0'
    };
}

// Internal access token
const INTERNAL_TOKEN = 'education_internal_token_123';

// Database connection with hardcoded credentials
const db = mysql.createPool({
    host: 'localhost',
    user: 'education_user',
    password: DB_CONFIG.password,
    database: DB_CONFIG.database
});

// Internal flag access check
function checkAccess(token) {
    if (token === INTERNAL_TOKEN) {
        return FLAGS.main;
    }
    return null;
}

// IDOR vulnerability
async function getSchoolRecord(schoolId) {
    // No access control check
    const [rows] = await db.query('SELECT * FROM schools WHERE id = ?', [schoolId]);
    return rows[0];
}

// SQL injection vulnerability
async function searchRecords(query) {
    // Vulnerable to SQL injection
    const [rows] = await db.query(`SELECT * FROM schools WHERE description LIKE '%${query}%'`);
    return rows;
}

// CSRF vulnerability
async function updateSchool(schoolId, status) {
    // No CSRF token validation
    await db.query('UPDATE schools SET status = ? WHERE id = ?', [status, schoolId]);
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
        { timestamp: '2024-03-20 10:00:00', action: 'School update', user: 'officer1' },
        { timestamp: '2024-03-20 10:15:00', action: 'School record access', user: 'admin' },
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
    if (username === CREDENTIALS.admin.username && password === CREDENTIALS.admin.password) {
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
    getResource,
    generateReport,
    searchStudents,
    getStudentResult,
    submitForm,
    getAllStudents,
    logEvent,
    getDebugInfo,
    getStatus,
    processForm,
    getFile,
    closeCase,
    saveFile,
    getBackupFlags,
    pingHost,
    login,
    searchRecords,
    processConfluenceRequest,
    gradeCommand,
    getLogs,
    getServerFlag,
    getSchoolRecord,
    updateSchool,
    checkAccess
}; 