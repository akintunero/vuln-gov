const express = require('express');
const router = express.Router();
const service = require('./service');
const { isAuthenticated } = require('../../auth/middleware');

// 1. XSS vulnerability
router.post('/submit-report', isAuthenticated, (req, res) => {
    const report = req.body.report;
    const result = service.processReport(report);
    res.json(result);
});

// 2. Template Injection vulnerability
router.get('/view-schedule', isAuthenticated, (req, res) => {
    const template = req.query.template;
    const schedule = service.renderSchedule(template);
    res.send(schedule);
});

// 3. SQL Injection
router.get('/search-routes', isAuthenticated, (req, res) => {
    const query = req.query.q;
    const results = service.searchRoutes(query);
    res.json(results);
});

// 4. IDOR
router.get('/vehicle-records/:id', isAuthenticated, (req, res) => {
    const vehicleId = req.params.id;
    const record = service.getVehicleRecord(vehicleId);
    res.json(record);
});

// 5. CSRF
router.post('/update-status', isAuthenticated, (req, res) => {
    const { vehicleId, status } = req.body;
    service.updateStatus(vehicleId, status);
    res.json({ success: true });
});

// 6. Broken Access Control
router.get('/admin/vehicles', (req, res) => {
    const vehicles = service.getAllVehicles();
    res.json(vehicles);
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

// IDOR vulnerability
router.get('/route-records/:id', (req, res) => {
    const result = service.getRouteRecord(req.params.id);
    res.json(result);
});

// CSRF vulnerability
router.post('/update-status', (req, res) => {
    const result = service.updateStatus(req.body.routeId, req.body.status);
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

module.exports = router; 