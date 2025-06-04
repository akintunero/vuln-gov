const express = require('express');
const router = express.Router();
const service = require('./service');

// Deserialization vulnerability
router.post('/process-data', (req, res) => {
    const result = service.processData(req.body.data);
    res.json(result);
});

// SSRF vulnerability
router.get('/fetch-resource', (req, res) => {
    service.fetchResource(req.query.url)
        .then(result => res.json(result))
        .catch(err => res.status(500).json({ error: err.message }));
});

// SQL Injection vulnerability
router.get('/search-programs', (req, res) => {
    const result = service.searchPrograms(req.query.q);
    res.json(result);
});

// IDOR vulnerability
router.get('/api/youth/program/:id', async (req, res) => {
    try {
        const record = await service.getProgramRecord(req.params.id);
        res.json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CSRF vulnerability
router.post('/api/youth/update-program', async (req, res) => {
    try {
        const result = await service.updateProgram(req.body.programId, req.body.status);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// File Upload vulnerability
router.post('/api/youth/upload', async (req, res) => {
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

// Exposed hidden route
router.get('/api/youth/backup-flag', async (req, res) => {
    try {
        const result = await service.getBackupFlag();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Log4Shell simulation
router.get('/log-event', (req, res) => {
    console.log(`User-Agent: ${req.headers['user-agent']}`);
    res.json({ success: true });
});

// Command Injection vulnerability
router.post('/tools/run', async (req, res) => {
    try {
        const output = await service.runCommand(req.body.command);
        res.json({ output });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// No CORS restriction
router.get('/api/youth/status', async (req, res) => {
    try {
        const status = await service.getStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// No rate limit on login
router.post('/api/youth/login', async (req, res) => {
    try {
        const result = await service.login(req.body.username, req.body.password);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// SQL injection vulnerability
router.get('/api/youth/search', async (req, res) => {
    try {
        const results = await service.searchRecords(req.query.q);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Exposed sensitive logs
router.get('/api/youth/logs', async (req, res) => {
    try {
        const logs = await service.getLogs();
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 