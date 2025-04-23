const express = require('express');
const router = express.Router();
const service = require('./service');

// Command Injection vulnerability
router.post('/run-script', (req, res) => {
    const result = service.runScript(req.body.script);
    res.json(result);
});

// Path Traversal vulnerability
router.get('/get-file', (req, res) => {
    const result = service.getFile(req.query.path);
    res.json(result);
});

// SQL Injection vulnerability
router.get('/search-projects', (req, res) => {
    const result = service.searchProjects(req.query.q);
    res.json(result);
});

// IDOR vulnerability
router.get('/api/infrastructure/project/:id', async (req, res) => {
    try {
        const record = await service.getProjectRecord(req.params.id);
        res.json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CSRF vulnerability
router.post('/api/infrastructure/update-project', async (req, res) => {
    try {
        const result = await service.updateProject(req.body.projectId, req.body.status);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// File Upload vulnerability
router.post('/api/infrastructure/upload', async (req, res) => {
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
router.get('/api/infrastructure/backup-flag', async (req, res) => {
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
router.get('/ping-host', (req, res) => {
    const result = service.pingHost(req.query.host);
    res.json(result);
});

// No CORS restriction
router.get('/api/infrastructure/status', async (req, res) => {
    try {
        const status = await service.getStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// No rate limit on login
router.post('/api/infrastructure/login', async (req, res) => {
    try {
        const result = await service.login(req.body.username, req.body.password);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// SQL injection vulnerability
router.get('/api/infrastructure/search', async (req, res) => {
    try {
        const records = await service.searchRecords(req.query.q);
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Exposed sensitive logs
router.get('/api/infrastructure/logs', async (req, res) => {
    try {
        const logs = await service.getLogs();
        res.json(logs);
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

module.exports = router; 