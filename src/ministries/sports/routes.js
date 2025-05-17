const express = require('express');
const router = express.Router();
const service = require('./service');

// Deserialization vulnerability
router.post('/process-data', (req, res) => {
    const result = service.processData(req.body.data);
    res.json(result);
});

// SSRF vulnerability
router.get('/fetch-resource', async (req, res) => {
    try {
        const result = await service.fetchResource(req.query.url);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// SQL Injection vulnerability
router.get('/search-events', (req, res) => {
    const result = service.searchEvents(req.query.q);
    res.json(result);
});

// IDOR vulnerability
router.get('/api/sports/event/:id', async (req, res) => {
    try {
        const record = await service.getEventRecord(req.params.id);
        res.json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CSRF vulnerability
router.post('/api/sports/update-event', async (req, res) => {
    try {
        const result = await service.updateEvent(req.body.eventId, req.body.status);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// File Upload vulnerability
router.post('/api/sports/upload', async (req, res) => {
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
router.get('/api/sports/backup-flag', async (req, res) => {
    try {
        const flag = await service.getBackupFlag();
        res.json(flag);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Log4Shell simulation
router.get('/log-event', (req, res) => {
    const result = service.logEvent(req.headers['user-agent']);
    res.json(result);
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
router.get('/api/sports/status', async (req, res) => {
    try {
        const status = await service.getStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// No rate limit on login
router.post('/api/sports/login', async (req, res) => {
    try {
        const result = await service.login(req.body.username, req.body.password);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// SQL injection vulnerability
router.get('/api/sports/search', async (req, res) => {
    try {
        const records = await service.searchRecords(req.query.q);
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Exposed sensitive logs
router.get('/api/sports/logs', async (req, res) => {
    try {
        const logs = await service.getLogs();
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 