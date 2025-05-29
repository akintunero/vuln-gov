const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

// Hidden flags
const FLAGS = {
    main: 'FLAG{transportation_ministry_xss_exploit}',
    debug: 'FLAG{transportation_ministry_debug_access}',
    admin: 'FLAG{transportation_ministry_admin_breach}'
};

// 1. XSS vulnerability
function processReport(report) {
    // Vulnerable to XSS - no sanitization
    return {
        success: true,
        report: report,
        flag: FLAGS.main
    };
}

// 2. Template Injection vulnerability
function renderSchedule(template) {
    // Vulnerable to template injection - using ejs with user input
    try {
        return ejs.render(template, {
            schedule: {
                route1: 'Route A',
                route2: 'Route B'
            }
        });
    } catch (error) {
        console.error('Error rendering schedule:', error);
        return 'Failed to render schedule';
    }
}

// 3. SQL Injection
function searchRoutes(query) {
    // Vulnerable to SQL injection
    const sql = `SELECT * FROM routes WHERE name LIKE '%${query}%'`;
    // Execute query...
    return { results: [], query: sql };
}

// 4. IDOR
function getVehicleRecord(vehicleId) {
    // Vulnerable to IDOR - no access control
    return {
        id: vehicleId,
        type: 'Bus',
        status: 'Active',
        flag: FLAGS.admin
    };
}

// 5. CSRF
function updateStatus(vehicleId, status) {
    // Vulnerable to CSRF - no token validation
    return { success: true, vehicleId, status };
}

// 6. Broken Access Control
function getAllVehicles() {
    // Vulnerable to broken access control
    return {
        vehicles: [
            { id: 1, type: 'Bus' },
            { id: 2, type: 'Train' }
        ],
        flag: FLAGS.admin
    };
}

// 7. Log Injection
function logEvent(event) {
    // Vulnerable to log injection
    console.log(`Transportation event: ${event}`);
    return true;
}

// 8. Debug Info
function getDebugInfo() {
    // Exposes debug information
    return {
        version: '1.0.0',
        environment: 'production',
        flag: FLAGS.debug
    };
}

// 9. Status with CORS
function getStatus() {
    return {
        status: 'operational',
        flag: FLAGS.main
    };
}

// 10. Content-Type parsing
function processForm(contentType, data) {
    // Vulnerable to content-type parsing
    if (contentType.includes('application/json')) {
        return { processed: true, data };
    }
    return { processed: false, error: 'Invalid content type' };
}

module.exports = {
    processReport,
    renderSchedule,
    searchRoutes,
    getVehicleRecord,
    updateStatus,
    getAllVehicles,
    logEvent,
    getDebugInfo,
    getStatus,
    processForm
}; 