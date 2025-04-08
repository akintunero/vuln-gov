const express = require('express');
const router = express.Router();
const service = require('./service');
const { isAuthenticated } = require('../../auth/middleware');

// 1. File Upload vulnerability
router.post('/upload-report', isAuthenticated, (req, res) => {
    const file = req.files.report;
    const result = service.saveReport(file);
    res.json(result);
});

// 2. Path Traversal vulnerability
router.get('/view-document', isAuthenticated, (req, res) => {
    const docPath = req.query.path;
    const content = service.getDocument(docPath);
    res.send(content);
});

// 3. SQL Injection
router.get('/search-sites', isAuthenticated, (req, res) => {
    const query = req.query.q;
    const results = service.searchSites(query);
    res.json(results);
});

// 4. IDOR
router.get('/site-records/:id', isAuthenticated, (req, res) => {
    const siteId = req.params.id;
    const record = service.getSiteRecord(siteId);
    res.json(record);
});

// 5. CSRF
router.post('/update-status', isAuthenticated, (req, res) => {
    const { siteId, status } = req.body;
    service.updateStatus(siteId, status);
    res.json({ success: true });
});

// 6. Broken Access Control
router.get('/admin/sites', (req, res) => {
    const sites = service.getAllSites();
    res.json(sites);
});

// 7. Log Injection
router.post('/log-event', isAuthenticated, (req, res) => {
    const event = req.body.event;
    service.logEvent(event);
    res.json({ success: true });
});

// 8. Exposed Debug Route
router.get('/debug/backup', (req, res) => {
    const debug = service.getDebugInfo();
    res.json(debug);
});

// 9. Misconfigured CORS
router.get('/api/status', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.json(service.getStatus());
});

// 10. Content-Type parsing vulnerability
router.post('/process-form', isAuthenticated, (req, res) => {
    const contentType = req.headers['content-type'];
    const result = service.processForm(contentType, req.body);
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
router.get('/report/:id', (req, res) => {
    const result = service.getReport(req.params.id);
    res.json(result);
});

// SQL Injection vulnerability
router.get('/data', (req, res) => {
    const result = service.getData(req.query.region);
    res.json(result);
});

// CVE-2018-7600 (Drupalgeddon2) simulation
router.post('/api/environment/drupal', (req, res) => {
    const result = service.processDrupalRequest(req.body);
    res.json(result);
});

// CSRF vulnerability
router.post('/api/environment/update-status', (req, res) => {
    const result = service.updateStatus(req.body.reportId, req.body.status);
    res.json(result);
});

// Command Injection vulnerability
router.get('/monitor', (req, res) => {
    service.monitorNode(req.query.node)
        .then(result => res.json(result))
        .catch(err => res.status(500).json({ error: err.message }));
});

// File Upload vulnerability
router.post('/api/environment/upload', (req, res) => {
    const result = service.saveDocument(req.files.file);
    res.json(result);
});

// Logging of internal paths
router.get('/api/environment/logs', (req, res) => {
    const result = service.getLogs();
    res.json(result);
});

// Exposed hidden route
router.get('/api/environment/flag', (req, res) => {
    const result = service.getBackupFlags();
    res.json(result);
});

// No rate limit on login
router.post('/api/environment/login', (req, res) => {
    const result = service.login(req.body.username, req.body.password);
    res.json(result);
});

// No CORS restriction
router.get('/api/environment/status', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    const result = service.getStatus();
    res.json(result);
});

// IDOR vulnerability
router.get('/api/environment/project/:id', async (req, res) => {
    try {
        const result = await service.getProjectRecord(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// SQL injection vulnerability
router.get('/api/environment/search', async (req, res) => {
    try {
        const result = await service.searchRecords(req.query.q);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CSRF vulnerability
router.post('/api/environment/update-project', async (req, res) => {
    try {
        const result = await service.updateProject(req.body.projectId, req.body.status);
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

// File upload vulnerability
router.post('/api/environment/upload', (req, res) => {
    try {
        const result = service.saveFile(req.files.file);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Exposed sensitive logs
router.get('/api/environment/logs', (req, res) => {
    const result = service.getLogs();
    res.json(result);
});

// Exposed hidden route
router.get('/api/environment/backup-flag', (req, res) => {
    const result = service.getBackupFlag();
    res.json(result);
});

// No rate limit on login
router.post('/api/environment/login', (req, res) => {
    const result = service.login(req.body.username, req.body.password);
    res.json(result);
});

// No CORS restriction
router.get('/api/environment/status', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    const result = service.getStatus();
    res.json(result);
});

// IDOR vulnerability
router.get('/api/environment/site/:id', async (req, res) => {
    try {
        const record = await service.getSiteRecord(req.params.id);
        res.json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// SQL injection vulnerability
router.get('/api/environment/search', async (req, res) => {
    try {
        const results = await service.searchRecords(req.query.q);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CSRF vulnerability
router.post('/api/environment/update-site', async (req, res) => {
    try {
        const result = await service.updateSite(req.body.siteId, req.body.status);
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
router.post('/api/environment/upload', async (req, res) => {
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
router.get('/api/environment/logs', async (req, res) => {
    try {
        const logs = await service.getLogs();
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Exposed hidden route
router.get('/api/environment/backup-flag', async (req, res) => {
    try {
        const result = await service.getBackupFlag();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// No rate limit on login
router.post('/api/environment/login', async (req, res) => {
    try {
        const result = await service.login(req.body.username, req.body.password);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// No CORS restriction
router.get('/api/environment/status', async (req, res) => {
    try {
        const status = await service.getStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 