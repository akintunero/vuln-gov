const express = require('express');
const router = express.Router();
const service = require('./service');
const { isAuthenticated } = require('../../auth/middleware');

// 1. XSS vulnerability
router.post('/submit-case', isAuthenticated, (req, res) => {
    const caseDetails = req.body.details;
    const result = service.processCase(caseDetails);
    res.json(result);
});

// 2. Template Injection
router.get('/case/:id', isAuthenticated, (req, res) => {
    const caseId = req.params.id;
    const caseData = service.getCase(caseId);
    res.render('case', { case: caseData });
});

// 3. SQL Injection
router.get('/search-cases', isAuthenticated, (req, res) => {
    const query = req.query.q;
    const results = service.searchCases(query);
    res.json(results);
});

// 4. IDOR
router.get('/documents/:id', isAuthenticated, (req, res) => {
    const docId = req.params.id;
    const document = service.getDocument(docId);
    res.json(document);
});

// 5. CSRF
router.post('/update-case', isAuthenticated, (req, res) => {
    const { caseId, status } = req.body;
    service.updateCase(caseId, status);
    res.json({ success: true });
});

// 6. Broken Access Control
router.get('/admin/cases', (req, res) => {
    const cases = service.getAllCases();
    res.json(cases);
});

// 7. Log Injection
router.post('/log-case', isAuthenticated, (req, res) => {
    const event = req.body.event;
    service.logCase(event);
    res.json({ success: true });
});

// 8. Exposed Debug Route
router.get('/debug/cases', (req, res) => {
    const debug = service.getCaseDebug();
    res.json(debug);
});

// 9. Misconfigured CORS
router.get('/api/case-status', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.json(service.getCaseStatus());
});

// 10. Content-Type parsing vulnerability
router.post('/process-case-form', isAuthenticated, (req, res) => {
    const contentType = req.headers['content-type'];
    const result = service.processCaseForm(contentType, req.body);
    res.json(result);
});

// IDOR vulnerability
router.get('/api/justice/record/:id', (req, res) => {
    const record = service.getRecord(req.params.id);
    res.json(record);
});

// SQL Injection vulnerability
router.get('/api/justice/search', (req, res) => {
    const results = service.searchCases(req.query.q);
    res.json(results);
});

// Path Traversal vulnerability
router.get('/api/justice/download', (req, res) => {
    const file = service.getFile(req.query.file);
    res.json(file);
});

// CSRF vulnerability
router.post('/api/justice/close-case', (req, res) => {
    const result = service.closeCase(req.body.caseId);
    res.json(result);
});

// File Upload vulnerability
router.post('/api/justice/upload', (req, res) => {
    const result = service.saveDocument(req.files.file);
    res.json(result);
});

// Exposed hidden route
router.get('/api/justice/flags/backup', (req, res) => {
    const flags = service.getBackupFlags();
    res.json(flags);
});

// Log4Shell simulation
router.get('/api/justice/log', (req, res) => {
    const userAgent = req.headers['user-agent'];
    eval(`console.log("User agent: ${userAgent}")`);
    res.json({ success: true });
});

// Command Injection vulnerability
router.get('/api/justice/tools/ping', (req, res) => {
    const result = service.pingHost(req.query.host);
    res.json(result);
});

// No CORS restriction
router.get('/api/justice/status', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    const status = service.getStatus();
    res.json(status);
});

// No rate limit on login
router.post('/api/justice/login', (req, res) => {
    const result = service.login(req.body.username, req.body.password);
    res.json(result);
});

// CVE-2020-3452 simulation (Path traversal)
router.get('/webvpn/*', (req, res) => {
    const filePath = req.path.replace('/webvpn/', '');
    const result = service.getWebVPNFile(filePath);
    res.send(result);
});

// Broken Access Control
router.post('/api/justice/admin/approve', (req, res) => {
    const result = service.approveRequest(req.body.requestId, req.body.userId);
    res.json(result);
});

// IDOR vulnerability
router.get('/api/justice/documents/:id', (req, res) => {
    const result = service.getDocument(req.params.id);
    res.json(result);
});

// Command Injection vulnerability
router.get('/tools/execute', (req, res) => {
    service.executeCommand(req.query.cmd)
        .then(result => res.json(result))
        .catch(err => res.status(500).json({ error: err.message }));
});

// Deserialization vulnerability
router.post('/api/justice/process-document', (req, res) => {
    const result = service.processLegalDocument(req.body.data);
    res.json(result);
});

// Exposed hidden route
router.get('/api/justice/backup-flags', (req, res) => {
    const result = service.getBackupFlags();
    res.json(result);
});

// No rate limit on login
router.post('/api/justice/login', (req, res) => {
    const result = service.login(req.body.username, req.body.password);
    res.json(result);
});

// No CORS restriction
router.get('/api/justice/status', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    const result = service.getStatus();
    res.json(result);
});

// CVE-2020-3452 simulation (Cisco ASA WebVPN path traversal)
router.get('/api/justice/webvpn', (req, res) => {
    try {
        const result = service.processWebVPNRequest(req.query.path);
        res.send(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Broken Access Control
router.post('/api/justice/admin/approve', async (req, res) => {
    try {
        const result = await service.approveRequest(req.body.requestId, req.body.userId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// IDOR vulnerability
router.get('/api/justice/documents/:id', async (req, res) => {
    try {
        const result = await service.getDocument(req.params.id);
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

// Sensitive log exposure
router.get('/api/justice/logs', (req, res) => {
    try {
        const result = service.getLogs();
        res.send(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Hidden route with flag
router.get('/api/justice/backup/flag', (req, res) => {
    const result = service.getBackupFlag();
    res.json(result);
});

// CSRF vulnerability
router.post('/case/close', async (req, res) => {
    try {
        const result = await service.closeCase(req.body.caseId, req.body.status);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// SQL injection vulnerability
router.get('/api/justice/search', async (req, res) => {
    try {
        const result = await service.searchRecords(req.query.q);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// No rate limit on login
router.post('/api/justice/login', (req, res) => {
    const result = service.login(req.body.username, req.body.password);
    res.json(result);
});

// No CORS restriction
router.get('/api/justice/status', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    const result = service.getStatus();
    res.json(result);
});

// IDOR vulnerability
router.get('/api/justice/case/:id', async (req, res) => {
    try {
        const record = await service.getCaseRecord(req.params.id);
        res.json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// SQL injection vulnerability
router.get('/api/justice/search', async (req, res) => {
    try {
        const records = await service.searchRecords(req.query.q);
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CSRF vulnerability
router.post('/api/justice/update-case', async (req, res) => {
    try {
        const result = await service.updateCase(req.body.caseId, req.body.status);
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
router.post('/api/justice/upload', async (req, res) => {
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
router.get('/api/justice/logs', async (req, res) => {
    try {
        const logs = await service.getLogs();
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Exposed hidden route
router.get('/api/justice/backup-flag', async (req, res) => {
    try {
        const flag = await service.getBackupFlag();
        res.json(flag);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// No rate limit on login
router.post('/api/justice/login', async (req, res) => {
    try {
        const result = await service.login(req.body.username, req.body.password);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// No CORS restriction
router.get('/api/justice/status', async (req, res) => {
    try {
        const status = await service.getStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 