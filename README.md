# VulnGov - Government Vulnerability Testing Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Security](https://img.shields.io/badge/Security-Research-blue)](https://github.com/akintunero/vuln-gov/security)

A deliberately vulnerable government records management system for security testing and training. This project simulates a government portal with various security vulnerabilities that can be exploited to learn about web security concepts.

## ⚠️ Security Notice

This application is **intentionally vulnerable** and should **NEVER** be deployed in a production environment. It is designed for:

* Security research and education
* Penetration testing practice
* Learning about web application security
* Understanding common vulnerabilities

## 🎯 Project Purpose

VulnGov is an open-source project that simulates a government portal with various security vulnerabilities. It's designed to help security researchers, developers, and students learn about:

* Common web vulnerabilities
* Security best practices
* Penetration testing techniques
* Secure coding principles

## 🚀 Getting Started

### Prerequisites

* Node.js (v18 or higher)
* npm (v8 or higher)
* Docker (optional)
* MySQL (v8.0 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/akintunero/vuln-gov.git
cd vuln-gov
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your desired configuration
```

4. Start the application:
```bash
# Using npm
npm start

# Using Docker
docker-compose up --build
```

The application will be available at `http://localhost:3001`

## 🎮 Features

### Core Services

1. **Document Services**
   * Secure document upload
   * Document management
   * File type validation
   * Download capabilities

2. **User Management**
   * Role-based access control
   * Ministry-specific permissions
   * User authentication
   * Session management

3. **Record Management**
   * Ministry-specific records
   * Classification levels
   * Audit logging
   * Access control

4. **Security Features**
   * Intentionally vulnerable endpoints
   * CTF-style challenges
   * Hidden flags
   * Multiple attack vectors

## 🔍 Vulnerability Categories

1. **SQL Injection**
   - Location: Search functionality in each ministry
   - Goal: Extract sensitive data from the database
   - Hint: Try using SQL comments and UNION statements

2. **IDOR (Insecure Direct Object Reference)**
   - Location: Record access endpoints
   - Goal: Access records from other ministries
   - Hint: Look for predictable ID patterns

3. **File Upload Vulnerabilities**
   - Location: Document upload functionality
   - Goal: Upload and execute malicious files
   - Hint: Check file type validation

4. **Command Injection**
   - Location: System command execution endpoints
   - Goal: Execute arbitrary system commands
   - Hint: Look for script execution points

5. **Sensitive Data Exposure**
   - Location: API responses and error messages
   - Goal: Find exposed sensitive information
   - Hint: Check response headers and error messages

6. **Authentication Bypass**
   - Location: Authentication endpoints
   - Goal: Access restricted resources
   - Hint: Look for token validation issues

## 🎓 Learning Resources

* [OWASP Top 10](https://owasp.org/www-project-top-ten/)
* [Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
* [PortSwigger Web Security Academy](https://portswigger.net/web-security)
* [TryHackMe](https://tryhackme.com/)
* [HackTheBox](https://www.hackthebox.com/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Security Contributions

If you discover any real vulnerabilities (not intentionally implemented ones), please follow our [Responsible Disclosure Policy](SECURITY.md).

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚖️ Legal Disclaimer

This project is for educational purposes only. The authors are not responsible for any misuse or damage caused by this program. Users are responsible for ensuring they have permission to test any systems they deploy this application on.

## 👨‍💻 Author

**Olúmáyòwá Akinkuehinmi**
- GitHub: [@akintunero](https://github.com/akintunero)
- LinkedIn: [Olúmáyòwá Akinkuehinmi](https://linkedin.com/in/akintunero)

## 🙏 Acknowledgments

* OWASP for security guidelines
* The open-source community
* All contributors and security researchers

## 📧 Contact

For questions, suggestions, or security concerns, please open an issue in the GitHub repository.

---

**Note**: This is a deliberately vulnerable application. Do not use it in production or expose it to the internet without proper security measures.

## Challenge Categories

### 1. SQL Injection
- Location: Search functionality in each ministry
- Goal: Extract sensitive data from the database
- Hint: Try using SQL comments and UNION statements

### 2. IDOR (Insecure Direct Object Reference)
- Location: Record access endpoints
- Goal: Access records from other ministries
- Hint: Look for predictable ID patterns

### 3. File Upload Vulnerabilities
- Location: Document upload functionality
- Goal: Upload and execute malicious files
- Hint: Check file type validation

### 4. Command Injection
- Location: System command execution endpoints
- Goal: Execute arbitrary system commands
- Hint: Look for script execution points

### 5. Sensitive Data Exposure
- Location: API responses and error messages
- Goal: Find exposed sensitive information
- Hint: Check response headers and error messages

### 6. Authentication Bypass
- Location: Authentication endpoints
- Goal: Access restricted resources
- Hint: Look for token validation issues

## Flag Locations

Each ministry has multiple flags to discover:

1. Primary Flag
   - Located in the main record data
   - Format: `FLAG{ministry_flag_01}`

2. Backup Flag
   - Located in backup/archive data
   - Format: `FLAG{ministry_backup_01}`

3. Internal Flag
   - Requires deeper system access
   - Format: `FLAG{ministry_internal_01}`

## Ministry-Specific Challenges

### Health Ministry
- Focus: Medical record access
- Special Challenge: Patient data exposure

### Education Ministry
- Focus: Student records
- Special Challenge: Grade manipulation

### Transport Ministry
- Focus: Vehicle registration
- Special Challenge: License modification

### Interior Ministry
- Focus: Security clearances
- Special Challenge: Access level escalation

### Petroleum Ministry
- Focus: Resource management
- Special Challenge: Production data access

### Energy Ministry
- Focus: Power grid data
- Special Challenge: Infrastructure access

### Information Ministry
- Focus: Public records
- Special Challenge: Media control

### Defense Ministry
- Focus: Military operations
- Special Challenge: Classified data access

## Security Notice

This application is deliberately vulnerable and should only be used in controlled environments for security testing and training purposes. Do not deploy in production or expose to the internet.

## Contributing

Feel free to submit issues and enhancement requests! 