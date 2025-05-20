const express = require('express');
const router = express.Router();
const service = require('./service');

// 1. File Upload vulnerability
router.post('/upload-brochure', (req, res) => {
    const result = service.saveBrochure(req.files.brochure);
    res.json(result);
});

// 2. Path Traversal vulnerability
router.get('/view-document', (req, res) => {
    const document = service.getDocument(req.query.path);
    res.json(document);
});

// 3. SQL Injection
router.get('/search-destinations', (req, res) => {
    const results = service.searchDestinations(req.query.q);
    res.json(results);
});

// 4. IDOR
router.get('/tour-records/:id', (req, res) => {
    const record = service.getTourRecord(req.params.id);
    res.json(record);
});

// 5. CSRF
router.post('/update-status', (req, res) => {
    const result = service.updateStatus(req.body.tourId, req.body.status);
    res.json(result);
});

// 6. Broken Access Control
router.get('/admin/tours', (req, res) => {
    const tours = service.getAllTours();
    res.json(tours);
});

// 7. Log Injection
router.post('/log-event', (req, res) => {
    const result = service.logEvent(req.body.event);
    res.json(result);
});

// 8. Exposed Debug Route
router.get('/debug/backup', (req, res) => {
    const debug = service.getDebugInfo();
    res.json(debug);
});

// 9. Misconfigured CORS
router.get('/api/status', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    const status = service.getStatus();
    res.json(status);
});

// 10. Content-Type parsing vulnerability
router.post('/process-form', (req, res) => {
    const result = service.processForm(req.headers['content-type'], req.body);
    res.json(result);
});

// Command Injection vulnerability
router.post('/run-script', (req, res) => {
    const result = service.runScript(req.body.script);
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
router.get('/search-sites', (req, res) => {
    const result = service.searchSites(req.query.q);
    res.json(result);
});

// IDOR vulnerability
router.get('/site-records/:id', (req, res) => {
    const result = service.getSiteRecord(req.params.id);
    res.json(result);
});

// CSRF vulnerability
router.post('/update-status', (req, res) => {
    const result = service.updateStatus(req.body.siteId, req.body.status);
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
    const result = service.logEvent(req.headers['user-agent']);
    res.json(result);
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
router.get('/api/tourism/destination/:id', async (req, res) => {
    try {
        const record = await service.getDestinationRecord(req.params.id);
        res.json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// SQL injection vulnerability
router.get('/api/tourism/search', async (req, res) => {
    try {
        const records = await service.searchRecords(req.query.q);
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CSRF vulnerability
router.post('/api/tourism/update-destination', async (req, res) => {
    try {
        const result = await service.updateDestination(req.body.destinationId, req.body.status);
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
router.post('/api/tourism/upload', async (req, res) => {
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
router.get('/api/tourism/logs', async (req, res) => {
    try {
        const logs = await service.getLogs();
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Exposed hidden route
router.get('/api/tourism/backup-flag', async (req, res) => {
    try {
        const flag = await service.getBackupFlag();
        res.json(flag);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// No rate limit on login
router.post('/api/tourism/login', async (req, res) => {
    try {
        const result = await service.login(req.body.username, req.body.password);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// No CORS restriction
router.get('/api/tourism/status', async (req, res) => {
    try {
        const status = await service.getStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 