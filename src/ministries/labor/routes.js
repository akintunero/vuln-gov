const express = require('express');
const router = express.Router();
const service = require('./service');
const { isAuthenticated } = require('../../auth/middleware');

// 1. SQL Injection vulnerability
router.get('/search-workers', (req, res) => {
    const result = service.searchWorkers(req.query.q);
    res.json(result);
});

// 2. IDOR vulnerability
router.get('/worker-records/:id', (req, res) => {
    const result = service.getWorkerRecord(req.params.id);
    res.json(result);
});

// 3. File Upload
router.post('/upload-document', (req, res) => {
    const result = service.saveDocument(req.files.document);
    res.json(result);
});

// 4. Path Traversal
router.get('/view-document', (req, res) => {
    const result = service.getDocument(req.query.path);
    res.json(result);
});

// 5. CSRF
router.post('/update-status', (req, res) => {
    const result = service.updateStatus(req.body.workerId, req.body.status);
    res.json(result);
});

// 6. Broken Access Control
router.get('/admin/workers', (req, res) => {
    const result = service.getAllWorkers();
    res.json(result);
});

// 7. Log Injection
router.get('/log-event', (req, res) => {
    const result = service.logEvent(req.headers['user-agent']);
    res.json(result);
});

// 8. Exposed Debug Route
router.get('/debug/backup', (req, res) => {
    const result = service.getBackupFlags();
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

module.exports = router; 