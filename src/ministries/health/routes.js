const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../../middleware/auth');
const service = require('./service');

// Vulnerable to SQL injection
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        const results = await service.searchPatients(query);
        res.json(results);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Search failed' });
    }
});

// Vulnerable to IDOR
router.get('/prescription/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const prescription = await service.getPrescription(id);
        res.json(prescription);
    } catch (error) {
        console.error('Prescription error:', error);
        res.status(500).json({ error: 'Failed to get prescription' });
    }
});

// Vulnerable to CSRF
router.post('/update-status', async (req, res) => {
    try {
        const { patientId, status } = req.body;
        const result = await service.updateMedicalStatus(patientId, status);
        res.json(result);
    } catch (error) {
        console.error('Status update error:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

// Vulnerable to file upload
router.post('/upload-medical-record', isAuthenticated, async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const file = req.files.file;
        file.user = req.user?.username || 'anonymous';
        
        const result = await service.saveMedicalRecord(file);
        res.json(result);
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ error: 'File upload failed' });
    }
});

// Vulnerable to path traversal
router.get('/patient-records/:patientId', async (req, res) => {
    try {
        const { patientId } = req.params;
        const records = service.getPatientRecords(patientId);
        res.json(records);
    } catch (error) {
        console.error('Patient records error:', error);
        res.status(500).json({ error: 'Failed to get patient records' });
    }
});

// Vulnerable to file upload
router.post('/upload-file', isAuthenticated, async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const file = req.files.file;
        file.user = req.user?.username || 'anonymous';
        
        const result = await service.saveFile(file);
        res.json(result);
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ error: 'File upload failed' });
    }
});

// Vulnerable to command injection
router.post('/backup-records', isAuthenticated, async (req, res) => {
    try {
        const { sourcePath } = req.body;
        // Intentionally vulnerable: Command injection
        const backupCmd = `cp -r ${sourcePath} /app/backups/`;
        require('child_process').exec(backupCmd, (error, stdout, stderr) => {
            if (error) {
                console.error('Backup error:', error);
                return res.status(500).json({ error: 'Backup failed' });
            }
            res.json({ success: true, message: 'Backup completed' });
        });
    } catch (error) {
        console.error('Backup error:', error);
        res.status(500).json({ error: 'Backup failed' });
    }
});

// Vulnerable to XML external entity (XXE)
router.post('/parse-medical-data', isAuthenticated, async (req, res) => {
    try {
        const { xmlData } = req.body;
        // Intentionally vulnerable: XXE
        const parser = new (require('xml2js').Parser)({
            explicitArray: false,
            mergeAttrs: true
        });
        
        parser.parseString(xmlData, (err, result) => {
            if (err) {
                console.error('XML parsing error:', err);
                return res.status(400).json({ error: 'Invalid XML data' });
            }
            res.json(result);
        });
    } catch (error) {
        console.error('XML parsing error:', error);
        res.status(500).json({ error: 'Failed to parse XML data' });
    }
});

module.exports = router; 