const express = require('express');
const router = express.Router();
const service = require('./service');
const { isAuthenticated } = require('../../auth/middleware');

// 1. File Inclusion vulnerability
router.get('/view-resource', isAuthenticated, (req, res) => {
    const resourcePath = req.query.path;
    const content = service.getResource(resourcePath);
    res.send(content);
});

// 2. Command Injection vulnerability
router.post('/generate-report', isAuthenticated, (req, res) => {
    const { format, data } = req.body;
    const report = service.generateReport(format, data);
    res.json(report);
});

// 3. SQL Injection
router.get('/search-students', isAuthenticated, (req, res) => {
    const query = req.query.q;
    const results = service.searchStudents(query);
    res.json(results);
});

// 4. IDOR
router.get('/student-records/:id', isAuthenticated, (req, res) => {
    const studentId = req.params.id;
    const record = service.getStudentRecord(studentId);
    res.json(record);
});

// 5. CSRF
router.post('/update-grade', isAuthenticated, (req, res) => {
    const { studentId, grade } = req.body;
    service.updateGrade(studentId, grade);
    res.json({ success: true });
});

// 6. Broken Access Control
router.get('/admin/students', (req, res) => {
    const students = service.getAllStudents();
    res.json(students);
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

// IDOR vulnerability
router.get('/api/education/school/:id', async (req, res) => {
    try {
        const record = await service.getSchoolRecord(req.params.id);
        res.json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// SQL injection vulnerability
router.get('/api/education/search', async (req, res) => {
    try {
        const results = await service.searchRecords(req.query.q);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CSRF vulnerability
router.post('/api/education/update-school', async (req, res) => {
    try {
        const result = await service.updateSchool(req.body.schoolId, req.body.status);
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
router.post('/api/education/upload', async (req, res) => {
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
router.get('/api/education/logs', async (req, res) => {
    try {
        const logs = await service.getLogs();
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Exposed hidden route
router.get('/api/education/backup-flag', async (req, res) => {
    try {
        const result = await service.getBackupFlag();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// No rate limit on login
router.post('/api/education/login', async (req, res) => {
    try {
        const result = await service.login(req.body.username, req.body.password);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// No CORS restriction
router.get('/api/education/status', async (req, res) => {
    try {
        const status = await service.getStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 