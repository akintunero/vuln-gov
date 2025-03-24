const express = require('express');
const router = express.Router();
const service = require('./service');

// Command Injection vulnerability
router.post('/run-command', (req, res) => {
    const result = service.runCommand(req.body.command);
    res.json(result);
});

// SSRF vulnerability
router.get('/fetch-resource', (req, res) => {
    service.fetchResource(req.query.url)
        .then(result => res.json(result))
        .catch(err => res.status(500).json({ error: err.message }));
});

// SQL Injection vulnerability
router.get('/search-messages', (req, res) => {
    const result = service.searchMessages(req.query.q);
    res.json(result);
});

// IDOR vulnerability
router.get('/message-records/:id', (req, res) => {
    const result = service.getMessageRecord(req.params.id);
    res.json(result);
});

// CSRF vulnerability
router.post('/update-status', (req, res) => {
    const result = service.updateStatus(req.body.messageId, req.body.status);
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
    console.log(`User-Agent: ${req.headers['user-agent']}`);
    res.json({ success: true });
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