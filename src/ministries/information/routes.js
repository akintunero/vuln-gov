const express = require('express');
const router = express.Router();
const service = require('./service');
const { isAuthenticated } = require('../../auth/middleware');

// 1. XSS vulnerability
router.post('/publish-news', (req, res) => {
    const result = service.publishNews(req.body.content);
    res.json(result);
});

// 2. Template Injection vulnerability
router.get('/render-bulletin', (req, res) => {
    const result = service.renderBulletin(req.query.template);
    res.json(result);
});

// 3. SQL Injection
router.get('/search-articles', (req, res) => {
    const result = service.searchArticles(req.query.q);
    res.json(result);
});

// 4. IDOR
router.get('/article-records/:id', (req, res) => {
    const result = service.getArticleRecord(req.params.id);
    res.json(result);
});

// 5. CSRF
router.post('/update-status', (req, res) => {
    const result = service.updateStatus(req.body.articleId, req.body.status);
    res.json(result);
});

// 6. Broken Access Control
router.get('/admin/articles', (req, res) => {
    const articles = service.getAllArticles();
    res.json(articles);
});

// 7. Log Injection
router.get('/log-event', (req, res) => {
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
router.get('/api/information/news/:id', async (req, res) => {
    try {
        const news = await service.getNewsRecord(req.params.id);
        res.json(news);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// SQL injection vulnerability
router.get('/api/information/search', async (req, res) => {
    try {
        const results = await service.searchRecords(req.query.q);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CSRF vulnerability
router.post('/api/information/update-news', async (req, res) => {
    try {
        const result = await service.updateNews(req.body.newsId, req.body.status);
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
router.post('/api/information/upload', async (req, res) => {
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
router.get('/api/information/logs', async (req, res) => {
    try {
        const logs = service.getLogs();
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Exposed hidden route
router.get('/api/information/backup-flag', async (req, res) => {
    try {
        const result = service.getBackupFlag();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// No rate limit on login
router.post('/api/information/login', async (req, res) => {
    try {
        const result = service.login(req.body.username, req.body.password);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// No CORS restriction
router.get('/api/information/status', async (req, res) => {
    try {
        const status = service.getStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 