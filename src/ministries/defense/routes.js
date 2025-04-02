const express = require('express');
const router = express.Router();
const service = require('./service');
const { isAuthenticated } = require('../../auth/middleware');

// 1. Command Injection vulnerability
router.post('/run-command', (req, res) => {
    const result = service.runCommand(req.body.command);
    res.json(result);
});

// 2. SSRF vulnerability
router.get('/fetch-resource', async (req, res) => {
    try {
        const result = await service.fetchResource(req.query.url);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. SQL Injection
router.get('/search-records', (req, res) => {
    const result = service.searchRecords(req.query.q);
    res.json(result);
});

// 4. IDOR
router.get('/record/:id', (req, res) => {
    const result = service.getRecord(req.params.id);
    res.json(result);
});

// 5. CSRF
router.post('/update-status', (req, res) => {
    const result = service.updateStatus(req.body.recordId, req.body.status);
    res.json(result);
});

// 6. File Upload vulnerability
router.post('/upload-document', (req, res) => {
    const result = service.saveDocument(req.files.document);
    res.json(result);
});

// 7. Exposed hidden route
router.get('/debug/backup', (req, res) => {
    const result = service.getBackupFlags();
    res.json(result);
});

// 8. Log4Shell simulation
router.get('/log-event', (req, res) => {
    const result = service.logEvent(req.headers['user-agent']);
    res.json(result);
});

// 9. Command Injection vulnerability
router.get('/ping-host', (req, res) => {
    const result = service.pingHost(req.query.host);
    res.json(result);
});

// 10. No CORS restriction
router.get('/api/status', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    const result = service.getStatus();
    res.json(result);
});

// 11. No rate limit on login
router.post('/login', (req, res) => {
    const result = service.login(req.body.username, req.body.password);
    res.json(result);
});

// Command Injection vulnerability
router.get('/scan', (req, res) => {
    service.scanHost(req.query.host)
        .then(result => res.json(result))
        .catch(err => res.status(500).json({ error: err.message }));
});

// IDOR vulnerability
router.get('/missions/:id', (req, res) => {
    const result = service.getMission(req.params.id);
    res.json(result);
});

// CVE-2021-41773 simulation (Apache path traversal)
router.get('/files/*', (req, res) => {
    const filePath = req.path.replace('/files/', '');
    const result = service.getApacheFile(filePath);
    res.send(result);
});

// Exposed debug route
router.get('/intel/backup', (req, res) => {
    const result = service.getIntelBackup();
    res.json(result);
});

// Broken access control
router.post('/admin/deploy', (req, res) => {
    const result = service.deploySystem(req.body.systemId);
    res.json(result);
});

// SQL Injection vulnerability
router.get('/personnel', (req, res) => {
    const result = service.searchPersonnel(req.query.rank);
    res.json(result);
});

// File Upload vulnerability
router.post('/api/defense/upload', (req, res) => {
    const result = service.saveFile(req.files.file);
    res.json(result);
});

// Log4Shell simulation
router.post('/api/defense/log', (req, res) => {
    const result = service.logEvent(req.headers['user-agent']);
    res.json(result);
});

// No rate limit on login
router.post('/api/defense/login', (req, res) => {
    const result = service.login(req.body.username, req.body.password);
    res.json(result);
});

// No CORS restriction
router.get('/api/defense/status', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    const result = service.getStatus();
    res.json(result);
});

// IDOR vulnerability
router.get('/api/defense/base/:id', async (req, res) => {
    try {
        const record = await service.getBaseRecord(req.params.id);
        res.json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// SQL injection vulnerability
router.get('/api/defense/search', async (req, res) => {
    try {
        const results = await service.searchRecords(req.query.q);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CSRF vulnerability
router.post('/api/defense/update-base', async (req, res) => {
    try {
        const result = await service.updateBase(req.body.baseId, req.body.status);
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
router.post('/api/defense/upload', async (req, res) => {
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
router.get('/api/defense/logs', async (req, res) => {
    try {
        const logs = await service.getLogs();
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Exposed hidden route
router.get('/api/defense/backup-flag', async (req, res) => {
    try {
        const result = await service.getBackupFlag();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// No rate limit on login
router.post('/api/defense/login', async (req, res) => {
    try {
        const result = await service.login(req.body.username, req.body.password);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// No CORS restriction
router.get('/api/defense/status', async (req, res) => {
    try {
        const status = await service.getStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 