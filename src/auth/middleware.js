// Authentication middleware
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/auth/login');
};

// Vulnerable to privilege escalation
const isAdmin = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    res.status(403).send('Access Denied');
};

// Vulnerable to session hijacking
const attachUser = (req, res, next) => {
    if (req.session && req.session.user) {
        res.locals.user = req.session.user;
    }
    next();
};

module.exports = {
    isAuthenticated,
    isAdmin,
    attachUser
}; 