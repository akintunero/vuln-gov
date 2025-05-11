const express = require('express');
const router = express.Router();
const service = require('./service');
const { isAuthenticated } = require('../../auth/middleware');

// 1. Command Injection vulnerability
router.post('/run-experiment', (req, res) => {
    const result = service.runExperiment(req.body.command);
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
router.get('/search-research', (req, res) => {
    const result = service.searchResearch(req.query.q);
    res.json(result);
});

// 4. IDOR
router.get('/research-records/:id', (req, res) => {
    const result = service.getResearchRecord(req.params.id);
    res.json(result);
});

// 5. CSRF
router.post('/update-status', (req, res) => {
    const result = service.updateStatus(req.body.researchId, req.body.status);
    res.json(result);
});

// 6. Broken Access Control
router.get('/admin/research', (req, res) => {
    const research = service.getAllResearch();
    res.json(research);
});

// 7. Log Injection
router.post('/log-event', (req, res) => {
    const result = service.logEvent(req.headers['user-agent']);
    res.json(result);
});

// 8. Exposed Debug Route
router.get('/debug/backup', (req, res) => {
    const result = service.getBackupFlags();
    res.json(result);
});

// 9. Misconfigured CORS
router.get('/api/status', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    const result = service.getStatus();
    res.json(result);
});

// 10. Content-Type parsing vulnerability
router.post('/process-form', isAuthenticated, (req, res) => {
    const contentType = req.headers['content-type'];
    const result = service.processForm(contentType, req.body);
    res.json(result);
});

// File Upload vulnerability
router.post('/upload-document', (req, res) => {
    const result = service.saveDocument(req.files.document);
    res.json(result);
});

// Command Injection vulnerability
router.get('/ping-host', (req, res) => {
    const result = service.pingHost(req.query.host);
    res.json(result);
});

// No rate limit on login
router.post('/login', (req, res) => {
    const result = service.login(req.body.username, req.body.password);
    res.json(result);
});

// IDOR vulnerability
router.get('/api/science/research/:id', async (req, res) => {
    try {
        const research = await service.getResearchRecord(req.params.id);
        res.json(research);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// SQL injection vulnerability
router.get('/api/science/search', async (req, res) => {
    try {
        const results = await service.searchRecords(req.query.q);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CSRF vulnerability
router.post('/api/science/update-research', async (req, res) => {
    try {
        const result = await service.updateResearch(req.body.researchId, req.body.status);
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
router.post('/api/science/upload', async (req, res) => {
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
router.get('/api/science/logs', async (req, res) => {
    try {
        const logs = service.getLogs();
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Exposed hidden route
router.get('/api/science/backup-flag', async (req, res) => {
    try {
        const result = service.getBackupFlag();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// No rate limit on login
router.post('/api/science/login', async (req, res) => {
    try {
        const result = service.login(req.body.username, req.body.password);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// No CORS restriction
router.get('/api/science/status', async (req, res) => {
    try {
        const status = service.getStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 