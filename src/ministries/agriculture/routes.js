const express = require('express');
const router = express.Router();
const service = require('./service');
const { isAuthenticated } = require('../../auth/middleware');

// 1. Deserialization vulnerability
router.post('/process-data', isAuthenticated, (req, res) => {
    const data = req.body.data;
    const result = service.processData(data);
    res.json(result);
});

// 2. SSRF vulnerability
router.get('/fetch-resource', isAuthenticated, (req, res) => {
    const url = req.query.url;
    const resource = service.fetchResource(url);
    res.json(resource);
});

// 3. SQL Injection
router.get('/search-crops', isAuthenticated, (req, res) => {
    const query = req.query.q;
    const results = service.searchCrops(query);
    res.json(results);
});

// 4. IDOR
router.get('/farm-records/:id', isAuthenticated, (req, res) => {
    const farmId = req.params.id;
    const record = service.getFarmRecord(farmId);
    res.json(record);
});

// 5. CSRF
router.post('/update-status', isAuthenticated, (req, res) => {
    const { farmId, status } = req.body;
    service.updateStatus(farmId, status);
    res.json({ success: true });
});

// 6. Broken Access Control
router.get('/admin/farms', (req, res) => {
    const farms = service.getAllFarms();
    res.json(farms);
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
router.get('/api/agriculture/run-script', (req, res) => {
    const result = service.runScript(req.query.script);
    res.json(result);
});

// SSRF vulnerability
router.get('/api/agriculture/fetch-data', (req, res) => {
    const result = service.fetchData(req.query.url);
    res.json(result);
});

// SQL Injection vulnerability
router.get('/api/agriculture/search', (req, res) => {
    const results = service.searchRecords(req.query.q);
    res.json(results);
});

// IDOR vulnerability
router.get('/api/agriculture/record/:id', (req, res) => {
    const record = service.getRecord(req.params.id);
    res.json(record);
});

// CSRF vulnerability
router.post('/api/agriculture/close-case', (req, res) => {
    const result = service.closeCase(req.body.caseId);
    res.json(result);
});

// File Upload vulnerability
router.post('/api/agriculture/upload', (req, res) => {
    const result = service.saveDocument(req.files.document);
    res.json(result);
});

// Exposed hidden route
router.get('/api/agriculture/flags/backup', (req, res) => {
    const flags = service.getBackupFlags();
    res.json(flags);
});

// Log4Shell simulation
router.get('/api/agriculture/log', (req, res) => {
    const userAgent = req.headers['user-agent'];
    eval(`console.log("User agent: ${userAgent}")`);
    res.json({ success: true });
});

// Command Injection vulnerability
router.get('/api/agriculture/tools/ping', (req, res) => {
    const result = service.pingHost(req.query.host);
    res.json(result);
});

// No CORS restriction
router.get('/api/agriculture/status', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    const status = service.getStatus();
    res.json(status);
});

// No rate limit on login
router.post('/api/agriculture/login', (req, res) => {
    const result = service.login(req.body.username, req.body.password);
    res.json(result);
});

// IDOR vulnerability
router.get('/api/agriculture/farmer/:id', async (req, res) => {
    try {
        const result = await service.getFarmerRecord(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CSRF vulnerability
router.post('/api/agriculture/claim-subsidy', (req, res) => {
    const result = service.claimSubsidy(req.body.farmerId, req.body.amount);
    res.json(result);
});

// SQL Injection vulnerability
router.get('/search-crops', (req, res) => {
    const result = service.searchCrops(req.query.filter);
    res.json(result);
});

// CVE-2019-0708 (BlueKeep RDP) simulation
router.post('/api/agriculture/rdp', (req, res) => {
    const result = service.processRDPRequest(req.body);
    res.json(result);
});

// File Upload vulnerability
router.post('/api/agriculture/submit-produce', (req, res) => {
    const result = service.saveProduce(req.files.file);
    res.json(result);
});

// Command Injection vulnerability
router.get('/utils/ping', (req, res) => {
    service.pingHost(req.query.host)
        .then(result => res.json(result))
        .catch(err => res.status(500).json({ error: err.message }));
});

// Log exposure of payment data
router.get('/api/agriculture/payments', (req, res) => {
    const result = service.getPaymentLogs();
    res.json(result);
});

// Exposed hidden route
router.get('/backup/agri-flag', (req, res) => {
    const result = service.getBackupFlags();
    res.json(result);
});

// No rate limit on login
router.post('/api/agriculture/login', (req, res) => {
    const result = service.login(req.body.username, req.body.password);
    res.json(result);
});

// No CORS restriction
router.get('/api/agriculture/status', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    const result = service.getStatus();
    res.json(result);
});

// CSRF vulnerability
router.post('/api/agriculture/update-subsidy', async (req, res) => {
    try {
        const result = await service.updateSubsidy(req.body.farmerId, req.body.amount);
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
router.post('/api/agriculture/upload', (req, res) => {
    try {
        const result = service.saveFile(req.files.file);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Exposed sensitive logs
router.get('/api/agriculture/logs', (req, res) => {
    const result = service.getLogs();
    res.json(result);
});

// Exposed hidden route
router.get('/api/agriculture/backup-flag', (req, res) => {
    const result = service.getBackupFlag();
    res.json(result);
});

// IDOR vulnerability
router.get('/api/agriculture/farm/:id', async (req, res) => {
    try {
        const record = await service.getFarmRecord(req.params.id);
        res.json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// SQL injection vulnerability
router.get('/api/agriculture/search', async (req, res) => {
    try {
        const results = await service.searchRecords(req.query.q);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CSRF vulnerability
router.post('/api/agriculture/update-farm', async (req, res) => {
    try {
        const result = await service.updateFarm(req.body.farmId, req.body.status);
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
router.post('/api/agriculture/upload', async (req, res) => {
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
router.get('/api/agriculture/logs', async (req, res) => {
    try {
        const logs = await service.getLogs();
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Exposed hidden route
router.get('/api/agriculture/backup-flag', async (req, res) => {
    try {
        const result = await service.getBackupFlag();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// No rate limit on login
router.post('/api/agriculture/login', async (req, res) => {
    try {
        const result = await service.login(req.body.username, req.body.password);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// No CORS restriction
router.get('/api/agriculture/status', async (req, res) => {
    try {
        const status = await service.getStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 