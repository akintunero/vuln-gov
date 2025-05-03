// Basic authentication middleware
const isAuthenticated = (req, res, next) => {
    // Intentionally vulnerable: No proper session validation
    if (req.session && req.session.user) {
        return next();
    }
    
    // Intentionally vulnerable: No proper error handling
    res.status(401).json({ error: 'Unauthorized' });
};

module.exports = {
    isAuthenticated
}; 