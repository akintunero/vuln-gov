const express = require('express');
const router = express.Router();
const service = require('./service');

// CVE-2022-22965 (Spring4Shell) simulation
router.post('/api/comms/spring', (req, res) => {
    try {
        const result = service.processSpringRequest(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CSRF vulnerability
router.post('/send-broadcast', async (req, res) => {
    try {
        const result = await service.sendBroadcast(req.body.message);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// IDOR vulnerability
router.get('/api/communications/message/:id', async (req, res) => {
    try {
        const message = await service.getMessageRecord(req.params.id);
        res.json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// SQL injection vulnerability
router.get('/api/communications/search', async (req, res) => {
    try {
        const results = await service.searchRecords(req.query.q);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CSRF vulnerability
router.post('/api/communications/update-message', async (req, res) => {
    try {
        const result = await service.updateMessage(req.body.messageId, req.body.status);
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
router.post('/api/communications/upload', async (req, res) => {
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
router.get('/api/communications/logs', async (req, res) => {
    try {
        const logs = service.getLogs();
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Exposed hidden route
router.get('/api/communications/backup-flag', async (req, res) => {
    try {
        const result = service.getBackupFlag();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// No rate limit on login
router.post('/api/communications/login', async (req, res) => {
    try {
        const result = service.login(req.body.username, req.body.password);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// No CORS restriction
router.get('/api/communications/status', async (req, res) => {
    try {
        const status = service.getStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// IDOR vulnerability
router.get('/api/communications/network/:id', async (req, res) => {
    try {
        const record = await service.getNetworkRecord(req.params.id);
        res.json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CSRF vulnerability
router.post('/api/communications/update-network', async (req, res) => {
    try {
        const result = await service.updateNetwork(req.body.networkId, req.body.status);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 