const express = require('express');
const router = express.Router();
const service = require('./service');

// Deserialization vulnerability
router.post('/process-data', (req, res) => {
    const result = service.processData(req.body.data);
    res.json(result);
});

// XXE vulnerability
router.post('/process-document', (req, res) => {
    service.processDocument(req.body.xmlData)
        .then(result => res.json(result))
        .catch(err => res.status(500).json({ error: err.message }));
});

// SQL Injection vulnerability
router.get('/search-artifacts', (req, res) => {
    const result = service.searchArtifacts(req.query.q);
    res.json(result);
});

// IDOR vulnerability
router.get('/artifact-records/:id', (req, res) => {
    const result = service.getArtifactRecord(req.params.id);
    res.json(result);
});

// CSRF vulnerability
router.post('/update-status', (req, res) => {
    const result = service.updateStatus(req.body.artifactId, req.body.status);
    res.json(result);
});

// File Upload vulnerability
router.post('/upload-document', (req, res) => {
    const result = service.saveDocument(req.files.document);
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
router.get('/api/culture/event/:id', async (req, res) => {
    try {
        const record = await service.getEventRecord(req.params.id);
        res.json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// SQL injection vulnerability
router.get('/api/culture/search', async (req, res) => {
    try {
        const records = await service.searchRecords(req.query.q);
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CSRF vulnerability
router.post('/api/culture/update-event', async (req, res) => {
    try {
        const result = await service.updateEvent(req.body.eventId, req.body.status);
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
router.post('/api/culture/upload', async (req, res) => {
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
router.get('/api/culture/logs', async (req, res) => {
    try {
        const logs = await service.getLogs();
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Exposed hidden route
router.get('/api/culture/backup-flag', async (req, res) => {
    try {
        const result = await service.getBackupFlag();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// No rate limit on login
router.post('/api/culture/login', async (req, res) => {
    try {
        const result = await service.login(req.body.username, req.body.password);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// No CORS restriction
router.get('/api/culture/status', async (req, res) => {
    try {
        const status = await service.getStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 