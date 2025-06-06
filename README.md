# VulnGov CTF Challenge

A government vulnerability management system containing various security challenges. Your mission is to identify and exploit the vulnerabilities while learning about secure coding practices.

## ⚠️ IMPORTANT WARNING

**DO NOT RUN THIS APPLICATION ON YOUR MAIN SYSTEM OR PRODUCTION ENVIRONMENT**

This project contains intentionally vulnerable code that could be dangerous if run in an unsecured environment. Always run this application in:

1. **Docker Container**
   ```bash
   docker build -t vulngov .
   docker run -p 3000:3000 vulngov
   ```

2. **Virtual Machine**
   - Use VirtualBox, VMware, or similar
   - Isolate the VM from your main network
   - Take regular snapshots

3. **Cloud Sandbox**
   - Use a disposable cloud instance
   - Configure strict network isolation
   - Delete the instance after use

4. **Local Sandbox**
   - Use tools like Docker Desktop
   - Configure network isolation
   - Use a dedicated testing user

**Security Precautions:**
- Never run as root/administrator
- Use a dedicated testing network
- Don't store sensitive data in the environment
- Regularly clean up and reset the environment
- Monitor system resources and network traffic
- Keep the environment isolated from production systems

## Challenge Overview

VulnGov is a simulated government system that contains various security challenges. Your task is to:

1. Identify the vulnerabilities
2. Understand how they can be exploited
3. Develop secure fixes
4. Document your findings

## Project Structure

```
vulngov/
├── src/
│   ├── ministries/           # Ministry-specific modules
│   ├── auth/                # Authentication and authorization
│   ├── middleware/          # Express middleware
│   ├── views/              # EJS templates
│   └── routes.js           # Main routing
├── database/               # Database scripts
├── tests/                 # Test files
└── config/               # Configuration files
```

## Challenge Categories

The system contains various types of vulnerabilities. Your mission is to find them all!

### Web Security Challenges
- Client-side vulnerabilities
- Server-side vulnerabilities
- Authentication bypasses
- Authorization issues
- Data exposure

### System Security Challenges
- Command execution
- File system access
- Database manipulation
- Network security
- Configuration issues

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=vulngov
   JWT_SECRET=your_secret
   ```
4. Set up the database:
   ```sql
   CREATE DATABASE vulngov;
   USE vulngov;
   -- Run the SQL scripts in the database/ directory
   ```
5. Run the application: `npm start`

## Challenge Objectives

1. Identify all vulnerabilities in the system
2. Document each vulnerability with:
   - Type of vulnerability
   - Location in the code
   - Steps to reproduce
   - Potential impact
   - Secure fix

3. Develop secure fixes for each vulnerability
4. Create a comprehensive security report

## Tools You Might Need

- Web browser with developer tools
- Network analysis tools
- Database management tools
- Security testing tools
- Code analysis tools

## Development

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## Security

This project contains intentionally vulnerable code for educational purposes. Do not deploy this in a production environment. See [SECURITY.md](SECURITY.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
