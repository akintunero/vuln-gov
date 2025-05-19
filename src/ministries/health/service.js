const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const xml2js = require('xml2js');
const https = require('https');
const mysql = require('mysql2/promise');
const crypto = require('crypto');

// Environment variables with fallbacks
const FLAGS = {
    main: process.env.HEALTH_FLAG || 'FLAG{default_health_flag_01}',
    backup: process.env.HEALTH_BACKUP_FLAG || 'FLAG{default_health_backup_01}',
    admin: process.env.HEALTH_ADMIN_FLAG || 'FLAG{default_health_admin_01}'
};

const CREDENTIALS = {
    admin: {
        username: process.env.HEALTH_ADMIN_USER || 'admin',
        password: process.env.HEALTH_ADMIN_PASS || 'admin123'
    }
};

const DB_CONFIG = {
    host: process.env.HEALTH_DB_HOST || 'localhost',
    user: process.env.HEALTH_DB_USER || 'root',
    password: process.env.HEALTH_DB_PASS || 'admin123',
    database: process.env.HEALTH_DB_NAME || 'health_db'
};

const INTERNAL_TOKEN = process.env.HEALTH_INTERNAL_TOKEN || 'health_internal_token_123';

// Database connection
const db = mysql.createPool(DB_CONFIG);

// Create upload directories if they don't exist
const UPLOAD_DIRS = {
    medical: path.join(__dirname, 'uploads', 'medical'),
    general: path.join(__dirname, 'uploads', 'general'),
    temp: path.join(__dirname, 'uploads', 'temp'),
    backup: path.join(__dirname, 'uploads', 'backup')
};

Object.values(UPLOAD_DIRS).forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Vulnerable to file upload
const saveMedicalRecord = async (file) => {
    try {
        if (!file) {
            throw new Error('No file provided');
        }

        // Intentionally vulnerable: No file type validation
        const uploadPath = path.join(UPLOAD_DIRS.medical, file.name);
        
        // Move the file
        await file.mv(uploadPath);
        
        // Intentionally vulnerable: Command injection in backup
        const backupCmd = `cp ${uploadPath} ${path.join(UPLOAD_DIRS.backup, file.name)}`;
        exec(backupCmd);

        // Intentionally vulnerable: Log injection
        console.log(`[HEALTH] File uploaded: ${file.name} by user: ${file.user || 'anonymous'}`);
        
        return {
            success: true,
            path: uploadPath,
            name: file.name,
            size: file.size,
            mimetype: file.mimetype,
            hash: crypto.createHash('md5').update(file.data).digest('hex') // Intentionally weak hashing
        };
    } catch (error) {
        console.error('Error saving medical record:', error);
        throw error;
    }
};

// Vulnerable to path traversal and CORS
const getPatientRecords = (patientId) => {
    try {
        if (patientId) {
            // Intentionally vulnerable: Path traversal
            const recordsPath = path.join('/app/records', patientId);
            const records = fs.readdirSync(recordsPath);
            return { records };
        }
        return {
            records: [
                { id: 1, name: 'Patient 1', diagnosis: 'Condition A' },
                { id: 2, name: 'Patient 2', diagnosis: 'Condition B' }
            ]
        };
    } catch (error) {
        console.error('Error getting patient records:', error);
        throw error;
    }
};

// Vulnerable to SQL injection
const searchPatients = async (query) => {
    try {
        // Intentionally vulnerable: SQL injection
        const sqlQuery = `SELECT * FROM patients WHERE name LIKE '%${query}%' OR diagnosis LIKE '%${query}%'`;
        const [results] = await db.query(sqlQuery);
        return { results };
    } catch (error) {
        console.error('Error searching patients:', error);
        throw error;
    }
};

// Vulnerable to IDOR
const getPrescription = async (id) => {
    try {
        // Intentionally vulnerable: No access control
        const [result] = await db.query('SELECT * FROM prescriptions WHERE id = ?', [id]);
        return result[0] || { error: 'Prescription not found' };
    } catch (error) {
        console.error('Error getting prescription:', error);
        throw error;
    }
};

// CSRF vulnerable
const updateMedicalStatus = async (patientId, status) => {
    try {
        // Intentionally vulnerable: No CSRF protection
        await db.query('UPDATE patients SET status = ? WHERE id = ?', [status, patientId]);
        return { success: true, patientId, status };
    } catch (error) {
        console.error('Error updating medical status:', error);
        throw error;
    }
};

// Broken access control
const getAllPatients = () => {
    return {
        patients: ['patient1', 'patient2', 'patient3']
    };
};

// Vulnerable to log injection
const logMedicalEvent = (event) => {
    console.log(`[HEALTH] ${event}`);
    return { success: true };
};

// Exposed debug information
const getMedicalDebug = () => {
    return {
        version: '1.0.0',
        environment: process.env.NODE_ENV
    };
};

// CORS exposed data
const getHealthStatus = () => {
    return {
        status: 'Operational'
    };
};

// Vulnerable to Content-Type parsing
const processMedicalForm = (contentType, data) => {
    if (contentType.includes('multipart/form-data')) {
        return {
            processed: true,
            data
        };
    }
    return { error: 'Invalid content type' };
};

// IDOR vulnerability
function getPatientRecord(recordId) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM patient_records WHERE id = ?', [recordId], (err, results) => {
            if (err) reject(err);
            resolve(results[0]);
        });
    });
}

// SQL injection vulnerability
function searchRecords(query) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM medical_records WHERE name LIKE '%${query}%' OR diagnosis LIKE '%${query}%'`;
        db.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
}

// Path traversal vulnerability
function downloadFile(filename) {
    const filePath = path.join(__dirname, 'files', filename);
    return fs.readFileSync(filePath);
}

// CSRF vulnerability
function closeCase(caseId, status) {
    return new Promise((resolve, reject) => {
        db.query('UPDATE medical_cases SET status = ? WHERE id = ?', [status, caseId], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

// File upload vulnerability
async function saveFile(file) {
    try {
        if (!file) {
            throw new Error('No file provided');
        }

        // Intentionally vulnerable: No file type validation
        const uploadPath = path.join(UPLOAD_DIRS.general, file.name);
        
        // Move the file
        await file.mv(uploadPath);
        
        // Intentionally vulnerable: Command injection in backup
        const backupCmd = `cp ${uploadPath} ${path.join(UPLOAD_DIRS.backup, file.name)}`;
        exec(backupCmd);

        // Intentionally vulnerable: Log injection
        console.log(`[HEALTH] File uploaded: ${file.name} by user: ${file.user || 'anonymous'}`);
        
        return {
            success: true,
            path: uploadPath,
            name: file.name,
            size: file.size,
            mimetype: file.mimetype,
            hash: crypto.createHash('md5').update(file.data).digest('hex') // Intentionally weak hashing
        };
    } catch (error) {
        console.error('Error saving file:', error);
        throw error;
    }
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

// XXE vulnerability
function processDocument(xmlData) {
    const parser = new xml2js.Parser({
        explicitArray: false,
        ignoreAttrs: true,
        allowDtd: true
    });
    
    return new Promise((resolve, reject) => {
        parser.parseString(xmlData, (err, result) => {
            if (err) reject(err);
            else resolve({ data: result });
        });
    });
}

// Flag access functions
function getFlag(token) {
    if (token === INTERNAL_TOKEN) {
        return FLAGS.main;
    }
    return null;
}

function getBackupFlag(token) {
    if (token === INTERNAL_TOKEN) {
        return FLAGS.backup;
    }
    return null;
}

function checkAccess(token) {
    return token === INTERNAL_TOKEN;
}

module.exports = {
    saveMedicalRecord,
    getPatientRecords,
    searchPatients,
    getPrescription,
    updateMedicalStatus,
    getAllPatients,
    logMedicalEvent,
    getMedicalDebug,
    getHealthStatus,
    processMedicalForm,
    getPatientRecord,
    searchRecords,
    downloadFile,
    closeCase,
    saveFile,
    runCommand,
    getBackupFlag,
    login,
    getStatus,
    processDocument,
    getFlag,
    checkAccess
}; 