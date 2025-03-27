require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const fileUpload = require('express-fileupload');
const fs = require('fs');

const app = express();

// Create necessary directories
const DIRECTORIES = {
    uploads: path.join(__dirname, 'uploads'),
    temp: path.join(__dirname, 'temp'),
    logs: path.join(__dirname, 'logs')
};

Object.values(DIRECTORIES).forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// File upload configuration
app.use(fileUpload({
    createParentPath: true,
    limits: { 
        fileSize: 50 * 1024 * 1024 // 50MB max file size
    },
    abortOnLimit: true,
    responseOnLimit: 'File size limit has been reached',
    useTempFiles: true,
    tempFileDir: DIRECTORIES.temp,
    debug: true,
    safeFileNames: false, // Intentionally vulnerable
    preserveExtension: true
}));

// Session configuration (intentionally vulnerable)
app.use(session({
    secret: process.env.SESSION_SECRET || 'insecure_session_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false, // Intentionally set to false for vulnerability
        httpOnly: false, // Intentionally set to false for vulnerability
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Request logging middleware (intentionally vulnerable to log injection)
app.use((req, res, next) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.path,
        ip: req.ip,
        userAgent: req.headers['user-agent']
    };
    console.log(JSON.stringify(logEntry));
    next();
});

// Import routes
const routes = require('./routes');

// Mount routes
app.use('/', routes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    const errorResponse = {
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        timestamp: new Date().toISOString()
    };
    res.status(500).json(errorResponse);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Upload directory: ${DIRECTORIES.uploads}`);
    console.log(`Temp directory: ${DIRECTORIES.temp}`);
    console.log(`Logs directory: ${DIRECTORIES.logs}`);
}); 