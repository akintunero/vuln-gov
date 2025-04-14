const express = require('express');
const router = express.Router();
const service = require('./service');
const { isAuthenticated } = require('../../auth/middleware');

// XXE vulnerability
router.post('/api/foreign/process-document', (req, res) => {
    const result = service.processDocument(req.body);
    res.json(result);
});

// CORS vulnerability
router.get('/api/foreign/diplomatic-records', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', '*');
    const records = service.getDiplomaticRecords();
    res.json(records);
});

// SQL Injection vulnerability
router.get('/api/foreign/search', (req, res) => {
    const results = service.searchRecords(req.query.q);
    res.json(results);
});

// IDOR vulnerability
router.get('/api/foreign/record/:id', (req, res) => {
    const record = service.getRecord(req.params.id);
    res.json(record);
});

// CSRF vulnerability
router.post('/api/foreign/update-status', (req, res) => {
    const result = service.updateStatus(req.body.recordId, req.body.status);
    res.json(result);
});

// File Upload vulnerability
router.post('/api/foreign/upload', (req, res) => {
    const result = service.saveDocument(req.files.document);
    res.json(result);
});

// Exposed hidden route
router.get('/api/foreign/flags/backup', (req, res) => {
    const flags = service.getBackupFlags();
    res.json(flags);
});

// Log4Shell simulation
router.get('/api/foreign/log', (req, res) => {
    const userAgent = req.headers['user-agent'];
    eval(`console.log("User agent: ${userAgent}")`);
    res.json({ success: true });
});

// Command Injection vulnerability
router.get('/api/foreign/tools/ping', (req, res) => {
    const result = service.pingHost(req.query.host);
    res.json(result);
});

// No rate limit on login
router.post('/api/foreign/login', (req, res) => {
    const result = service.login(req.body.username, req.body.password);
    res.json(result);
});

// 1. XXE vulnerability
router.post('/process-document', isAuthenticated, (req, res) => {
    const document = req.body.document;
    const result = service.processDocument(document);
    res.json(result);
});

// 2. CORS vulnerability
router.get('/diplomatic-records', isAuthenticated, (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    const records = service.getDiplomaticRecords();
    res.json(records);
});

// 3. SQL Injection
router.get('/search-records', isAuthenticated, (req, res) => {
    const query = req.query.q;
    const results = service.searchRecords(query);
    res.json(results);
});

// 4. IDOR
router.get('/documents/:id', isAuthenticated, (req, res) => {
    const docId = req.params.id;
    const document = service.getDocument(docId);
    res.json(document);
});

// 5. CSRF
router.post('/update-status', isAuthenticated, (req, res) => {
    const { docId, status } = req.body;
    service.updateStatus(docId, status);
    res.json({ success: true });
});

// 6. Broken Access Control
router.get('/admin/records', (req, res) => {
    const records = service.getAllRecords();
    res.json(records);
});

// 7. Log Injection
router.post('/log-event', isAuthenticated, (req, res) => {
    const event = req.body.event;
    service.logEvent(event);
    res.json({ success: true });
});

// 8. Exposed Debug Route
router.get('/debug/backup', (req, res) => {
    const debug = service.getDebugInfo();
    res.json(debug);
});

// 9. Misconfigured CORS
router.get('/api/status', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.json(service.getStatus());
});

// 10. Content-Type parsing vulnerability
router.post('/process-form', isAuthenticated, (req, res) => {
    const contentType = req.headers['content-type'];
    const result = service.processForm(contentType, req.body);
    res.json(result);
});

// IDOR vulnerability
router.get('/api/foreign/passport/:id', (req, res) => {
    const result = service.getPassport(req.params.id);
    res.json(result);
});

// SQL Injection vulnerability
router.get('/api/foreign/search', (req, res) => {
    const result = service.searchRecords(req.query.query);
    res.json(result);
});

// CSRF vulnerability
router.post('/api/foreign/request-visa', (req, res) => {
    const result = service.requestVisa(req.body);
    res.json(result);
});

// CVE-2019-19781 simulation (Citrix ADC RCE)
router.post('/api/foreign/process', (req, res) => {
    const result = service.processCitrixRequest(req.body);
    res.json(result);
});

// Command Injection vulnerability
router.get('/dns/lookup', (req, res) => {
    service.lookupDNS(req.query.host)
        .then(result => res.json(result))
        .catch(err => res.status(500).json({ error: err.message }));
});

// File Upload vulnerability
router.post('/api/foreign/upload', (req, res) => {
    const result = service.saveFile(req.files.file);
    res.json(result);
});

// Broken access control
router.get('/api/foreign/consular', (req, res) => {
    const result = service.getConsularData();
    res.json(result);
});

// Sensitive logs exposure
router.get('/api/foreign/logs', (req, res) => {
    const result = service.getLogs();
    res.send(result);
});

// Exposed hidden route
router.get('/api/foreign/diplomatic-flag', (req, res) => {
    const result = service.getDiplomaticFlag();
    res.json(result);
});

// No rate limit on login
router.post('/api/foreign/login', (req, res) => {
    const result = service.login(req.body.username, req.body.password);
    res.json(result);
});

// No CORS restriction
router.get('/api/foreign/status', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    const result = service.getStatus();
    res.json(result);
});

// IDOR vulnerability
router.get('/api/foreign/diplomatic/:id', async (req, res) => {
    try {
        const record = await service.getDiplomaticRecord(req.params.id);
        res.json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// SQL injection vulnerability
router.get('/api/foreign/search', async (req, res) => {
    try {
        const records = await service.searchRecords(req.query.q);
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CSRF vulnerability
router.post('/api/foreign/update-diplomatic', async (req, res) => {
    try {
        const result = await service.updateDiplomaticRecord(req.body.recordId, req.body.status);
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
router.post('/api/foreign/upload', async (req, res) => {
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
router.get('/api/foreign/logs', async (req, res) => {
    try {
        const logs = await service.getLogs();
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Exposed hidden route
router.get('/api/foreign/backup-flag', async (req, res) => {
    try {
        const result = await service.getBackupFlag();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// No rate limit on login
router.post('/api/foreign/login', async (req, res) => {
    try {
        const result = await service.login(req.body.username, req.body.password);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// No CORS restriction
router.get('/api/foreign/status', async (req, res) => {
    try {
        const status = await service.getStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 