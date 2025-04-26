const express = require('express');
const router = express.Router();
const service = require('./service');
const { isAuthenticated } = require('../../auth/middleware');

// Deserialization vulnerability
router.post('/api/interior/process-document', (req, res) => {
    const result = service.processDocument(req.body);
    res.json(result);
});

// SSRF vulnerability
router.get('/api/interior/fetch-resource', (req, res) => {
    const result = service.fetchResource(req.query.url);
    res.json(result);
});

// SQL Injection vulnerability
router.get('/api/interior/search-records', (req, res) => {
    const results = service.searchRecords(req.query.q);
    res.json(results);
});

// IDOR vulnerability
router.get('/api/interior/record/:id', (req, res) => {
    const record = service.getRecord(req.params.id);
    res.json(record);
});

// SQL Injection vulnerability
router.get('/api/interior/search', (req, res) => {
    const results = service.searchRecords(req.query.q);
    res.json(results);
});

// CSRF vulnerability
router.post('/api/interior/update-status', (req, res) => {
    const result = service.updateStatus(req.body.docId, req.body.status);
    res.json(result);
});

// Broken Access Control
router.get('/api/interior/admin/documents', (req, res) => {
    const documents = service.getAllDocuments();
    res.json(documents);
});

// Log Injection vulnerability
router.post('/api/interior/log-event', (req, res) => {
    const result = service.logEvent(req.body.event);
    res.json(result);
});

// Exposed Debug Route
router.get('/api/interior/debug/backup', (req, res) => {
    const debug = service.getDebugInfo();
    res.json(debug);
});

// Misconfigured CORS
router.get('/api/interior/status', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    const status = service.getStatus();
    res.json(status);
});

// Content-Type parsing vulnerability
router.post('/api/interior/process-form', (req, res) => {
    const result = service.processForm(req.headers['content-type'], req.body);
    res.json(result);
});

// Path Traversal vulnerability
router.get('/api/interior/download', (req, res) => {
    const file = service.getFile(req.query.file);
    res.json(file);
});

// CSRF vulnerability
router.post('/api/interior/close-case', (req, res) => {
    const result = service.closeCase(req.body.caseId);
    res.json(result);
});

// File Upload vulnerability
router.post('/api/interior/upload', (req, res) => {
    const result = service.saveDocument(req.files.document);
    res.json(result);
});

// Exposed hidden route
router.get('/api/interior/flags/backup', (req, res) => {
    const flags = service.getBackupFlags();
    res.json(flags);
});

// Log4Shell simulation
router.get('/api/interior/log', (req, res) => {
    const userAgent = req.headers['user-agent'];
    eval(`console.log("User agent: ${userAgent}")`);
    res.json({ success: true });
});

// Command Injection vulnerability
router.get('/api/interior/tools/ping', (req, res) => {
    const result = service.pingHost(req.query.host);
    res.json(result);
});

// No rate limit on login
router.post('/api/interior/login', (req, res) => {
    const result = service.login(req.body.username, req.body.password);
    res.json(result);
});

// Path Traversal vulnerability
router.get('/get-file', (req, res) => {
    const result = service.getFile(req.query.path);
    res.json(result);
});

// File Upload vulnerability
router.post('/upload-document', (req, res) => {
    const result = service.saveDocument(req.files.document);
    res.json(result);
});

// SQL Injection vulnerability
router.get('/search-records', (req, res) => {
    const result = service.searchRecords(req.query.q);
    res.json(result);
});

// IDOR vulnerability
router.get('/records/:id', (req, res) => {
    const result = service.getRecord(req.params.id);
    res.json(result);
});

// CSRF vulnerability
router.post('/update-status', (req, res) => {
    const result = service.updateStatus(req.body.recordId, req.body.status);
    res.json(result);
});

// Exposed hidden route
router.get('/debug/backup', (req, res) => {
    const result = service.getBackupFlags();
    res.json(result);
});

// Log4Shell simulation
router.get('/log-event', (req, res) => {
    console.log(`User-Agent: ${req.headers['user-agent']}`);
    res.json({ success: true });
});

// Command Injection vulnerability
router.get('/ping-host', (req, res) => {
    const result = service.pingHost(req.query.host);
    res.json(result);
});

// No CORS restriction
router.get('/api/status', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    const result = service.getStatus();
    res.json(result);
});

// No rate limit on login
router.post('/login', (req, res) => {
    const result = service.login(req.body.username, req.body.password);
    res.json(result);
});

// IDOR vulnerability
router.get('/api/interior/citizen/:id', async (req, res) => {
    try {
        const result = await service.getCitizenRecord(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// SQL injection vulnerability
router.get('/api/interior/search', async (req, res) => {
    try {
        const result = await service.searchRecords(req.query.q);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CSRF vulnerability
router.post('/api/interior/update-status', async (req, res) => {
    try {
        const result = await service.updateStatus(req.body.recordId, req.body.status);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Command injection vulnerability
router.get('/tools/run', async (req, res) => {
    try {
        const result = await service.runCommand(req.query.cmd);
        res.json({ output: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// File upload vulnerability
router.post('/api/interior/upload', (req, res) => {
    try {
        const result = service.saveFile(req.files.file);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Sensitive logs exposure
router.get('/api/interior/logs', (req, res) => {
    try {
        const result = service.getLogs();
        res.send(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Exposed hidden route
router.get('/api/interior/backup-flag', (req, res) => {
    const result = service.getBackupFlag();
    res.json(result);
});

// No CORS restriction
router.get('/api/interior/status', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    const result = service.getStatus();
    res.json(result);
});

// IDOR vulnerability
router.get('/api/interior/facility/:id', async (req, res) => {
    try {
        const record = await service.getFacilityRecord(req.params.id);
        res.json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// SQL injection vulnerability
router.get('/api/interior/search', async (req, res) => {
    try {
        const records = await service.searchRecords(req.query.q);
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CSRF vulnerability
router.post('/api/interior/update-facility', async (req, res) => {
    try {
        const result = await service.updateFacility(req.body.facilityId, req.body.status);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Command injection vulnerability
router.post('/tools/run', async (req, res) => {
    try {
        const output = await service.runCommand(req.body.command);
        res.json({ output });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// File upload vulnerability
router.post('/api/interior/upload', async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const result = await service.saveFile(req.files.file);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Exposed sensitive logs
router.get('/api/interior/logs', async (req, res) => {
    try {
        const logs = await service.getLogs();
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Exposed hidden route
router.get('/api/interior/backup-flag', async (req, res) => {
    try {
        const flag = await service.getBackupFlag();
        res.json(flag);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// No rate limit on login
router.post('/api/interior/login', async (req, res) => {
    try {
        const result = await service.login(req.body.username, req.body.password);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// No CORS restriction
router.get('/api/interior/status', async (req, res) => {
    try {
        const status = await service.getStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 