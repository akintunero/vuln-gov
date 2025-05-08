const express = require('express');
const router = express.Router();
const service = require('./service');

// IDOR vulnerability
router.get('/api/petroleum/well/:id', async (req, res) => {
    try {
        const record = await service.getWellRecord(req.params.id);
        res.json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// SQL injection vulnerability
router.get('/api/petroleum/search', async (req, res) => {
    try {
        const records = await service.searchRecords(req.query.q);
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CSRF vulnerability
router.post('/api/petroleum/update-well', async (req, res) => {
    try {
        const result = await service.updateWell(req.body.wellId, req.body.status);
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
router.post('/api/petroleum/upload', async (req, res) => {
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
router.get('/api/petroleum/logs', async (req, res) => {
    try {
        const logs = await service.getLogs();
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Exposed hidden route
router.get('/api/petroleum/backup-flag', async (req, res) => {
    try {
        const flag = await service.getBackupFlag();
        res.json(flag);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// No rate limit on login
router.post('/api/petroleum/login', async (req, res) => {
    try {
        const result = await service.login(req.body.username, req.body.password);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// No CORS restriction
router.get('/api/petroleum/status', async (req, res) => {
    try {
        const status = await service.getStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 