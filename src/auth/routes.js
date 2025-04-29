const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('./middleware');

// Login page
router.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    res.render('login', { error: null });
});

// Login handler
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Intentionally vulnerable - no rate limiting
    if (username === 'admin' && password === 'admin123') {
        req.session.user = { username };
        return res.redirect('/dashboard');
    }
    
    res.render('login', { error: 'Invalid username or password' });
});

// Logout handler
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router; 