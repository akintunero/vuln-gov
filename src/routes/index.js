const express = require('express');
const router = express.Router();
const authRoutes = require('../auth/routes');
const { isAuthenticated } = require('../auth/middleware');

// Import all ministry routes
const ministries = [
    'agriculture',
    'aviation',
    'commerce',
    'defense',
    'education',
    'energy',
    'environment',
    'finance',
    'foreign-affairs',
    'health',
    'information',
    'interior',
    'justice',
    'labor',
    'petroleum',
    'transportation'
];

// Mount all ministry routes
ministries.forEach(ministry => {
    try {
        const ministryRoutes = require(`../ministries/${ministry}/routes`);
        router.use(`/${ministry}`, ministryRoutes);
    } catch (error) {
        console.error(`Error loading routes for ${ministry}:`, error);
    }
});

// Mount auth routes
router.use('/auth', authRoutes);

// Home route
router.get('/', (req, res) => {
    res.render('index', { user: req.session.user });
});

// Dashboard route
router.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard', { user: req.session.user });
});

module.exports = router; 