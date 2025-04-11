const express = require('express');
const router = express.Router();
const service = require('./service');
const { isAuthenticated } = require('../../auth/middleware');

// 1. SQL Injection in transaction search
router.get('/transactions', isAuthenticated, (req, res) => {
    const accountId = req.query.accountId;
    const transactions = service.getTransactions(accountId);
    res.json(transactions);
});

// 2. IDOR in account details
router.get('/accounts/:id', isAuthenticated, (req, res) => {
    const accountId = req.params.id;
    const account = service.getAccountDetails(accountId);
    res.json(account);
});

// 3. CSRF on money transfer
router.post('/transfer', isAuthenticated, (req, res) => {
    const { from, to, amount } = req.body;
    service.transferMoney(from, to, amount);
    res.json({ success: true });
});

// 4. Path Traversal in document download
router.get('/documents', isAuthenticated, (req, res) => {
    const docPath = req.query.path;
    service.getDocument(docPath);
    res.sendFile(docPath);
});

// 5. Broken Access Control on admin panel
router.get('/admin/users', (req, res) => {
    const users = service.getAllUsers();
    res.json(users);
});

// 6. File Upload (no validation)
router.post('/upload-statement', isAuthenticated, (req, res) => {
    const file = req.files.statement;
    service.saveStatement(file);
    res.json({ success: true });
});

// 7. Log Injection
router.post('/audit-log', isAuthenticated, (req, res) => {
    const message = req.body.message;
    service.logAudit(message);
    res.json({ success: true });
});

// 8. Exposed Debug Route
router.get('/debug/transactions', (req, res) => {
    const debug = service.getTransactionDebug();
    res.json(debug);
});

// 9. Misconfigured CORS
router.get('/api/balance', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.json(service.getBalance());
});

// 10. Content-Type parsing vulnerability
router.post('/process-document', isAuthenticated, (req, res) => {
    const contentType = req.headers['content-type'];
    const result = service.processDocument(contentType, req.body);
    res.json(result);
});

// SQL Injection vulnerability
router.get('/search-transactions', (req, res) => {
    const result = service.searchTransactions(req.query.q);
    res.json(result);
});

// IDOR vulnerability
router.get('/transaction-records/:id', (req, res) => {
    const result = service.getTransactionRecord(req.params.id);
    res.json(result);
});

// CSRF vulnerability
router.post('/update-status', (req, res) => {
    const result = service.updateStatus(req.body.transactionId, req.body.status);
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

// Referrer-based CSRF token leakage
router.get('/api/finance/csrf-token', (req, res) => {
    const token = service.getCSRFToken(req.headers.referer);
    res.json({ token });
});

// IDOR vulnerability
router.get('/invoice/:id', async (req, res) => {
    try {
        const result = await service.getInvoice(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// SQL injection vulnerability
router.get('/report', async (req, res) => {
    try {
        const result = await service.generateReport(req.query.filter);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// No authentication on budget export
router.get('/api/finance/budget/export', (req, res) => {
    try {
        const file = service.exportBudget();
        res.send(file);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Broken access control
router.post('/admin/payroll', async (req, res) => {
    try {
        const result = await service.updatePayroll(req.body.employeeId, req.body.salary);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// File upload vulnerability
router.post('/api/finance/upload', (req, res) => {
    try {
        const result = service.saveFile(req.files.file);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Sensitive logs exposure
router.get('/api/finance/logs', (req, res) => {
    try {
        const result = service.getLogs();
        res.send(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Command injection vulnerability
router.get('/tools/ping', async (req, res) => {
    try {
        const result = await service.pingServer(req.query.host);
        res.json({ output: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Exposed hidden route
router.get('/internal/flag-finance', (req, res) => {
    const result = service.getInternalFlag();
    res.json(result);
});

// No input sanitization on tax submission
router.post('/api/finance/tax/submit', async (req, res) => {
    try {
        const result = await service.submitTax(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// No rate limit on login
router.post('/api/finance/login', (req, res) => {
    const result = service.login(req.body.username, req.body.password);
    res.json(result);
});

// No CORS restriction
router.get('/api/finance/status', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    const result = service.getStatus();
    res.json(result);
});

// IDOR vulnerability
router.get('/api/finance/transaction/:id', async (req, res) => {
    try {
        const record = await service.getTransactionRecord(req.params.id);
        res.json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// SQL injection vulnerability
router.get('/api/finance/search', async (req, res) => {
    try {
        const results = await service.searchRecords(req.query.q);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CSRF vulnerability
router.post('/api/finance/update-transaction', async (req, res) => {
    try {
        const result = await service.updateTransaction(req.body.transactionId, req.body.status);
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
router.post('/api/finance/upload', async (req, res) => {
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
router.get('/api/finance/logs', async (req, res) => {
    try {
        const logs = await service.getLogs();
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Exposed hidden route
router.get('/api/finance/backup-flag', async (req, res) => {
    try {
        const result = await service.getBackupFlag();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// No rate limit on login
router.post('/api/finance/login', async (req, res) => {
    try {
        const result = await service.login(req.body.username, req.body.password);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// No CORS restriction
router.get('/api/finance/status', async (req, res) => {
    try {
        const status = await service.getStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 