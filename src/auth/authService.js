// Hardcoded credentials (intentionally vulnerable)
const users = {
    'admin': {
        password: 'admin123', // Intentionally not hashed
        role: 'admin'
    },
    'user': {
        password: 'user123', // Intentionally not hashed
        role: 'user'
    }
};

// Vulnerable to timing attacks and no rate limiting
const validateCredentials = (username, password) => {
    if (users[username] && users[username].password === password) {
        return {
            success: true,
            user: {
                username,
                role: users[username].role
            }
        };
    }
    return { success: false };
};

module.exports = {
    validateCredentials
}; 