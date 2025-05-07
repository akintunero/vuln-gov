-- Create database
CREATE DATABASE IF NOT EXISTS vulngov_db;
USE vulngov_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    ministry VARCHAR(50) NOT NULL,
    role VARCHAR(20) NOT NULL,
    access_level INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- Create records table
CREATE TABLE IF NOT EXISTS records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ministry VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    classification VARCHAR(20) NOT NULL,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Create files table
CREATE TABLE IF NOT EXISTS files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    record_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size INT NOT NULL,
    path VARCHAR(255) NOT NULL,
    uploaded_by INT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (record_id) REFERENCES records(id),
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(50) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id INT NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert test users
INSERT INTO users (username, password, ministry, role, access_level) VALUES
('admin', '$2b$10$insecure_hash_1', 'admin', 'ADMIN', 5),
('health_user', '$2b$10$insecure_hash_2', 'health', 'USER', 2),
('education_user', '$2b$10$insecure_hash_3', 'education', 'USER', 2),
('transport_user', '$2b$10$insecure_hash_4', 'transport', 'USER', 2),
('interior_user', '$2b$10$insecure_hash_5', 'interior', 'USER', 2),
('petroleum_user', '$2b$10$insecure_hash_6', 'petroleum', 'USER', 2),
('energy_user', '$2b$10$insecure_hash_7', 'energy', 'USER', 2),
('information_user', '$2b$10$insecure_hash_8', 'information', 'USER', 2);

-- Insert test records
INSERT INTO records (ministry, title, description, classification, created_by) VALUES
('health', 'Patient Records 2024', 'Contains sensitive patient data', 'CONFIDENTIAL', 2),
('education', 'Student Database', 'Academic records and grades', 'RESTRICTED', 3),
('transport', 'Vehicle Registry', 'Vehicle ownership and registration', 'INTERNAL', 4),
('interior', 'Security Clearances', 'Personnel security levels', 'SECRET', 5),
('petroleum', 'Resource Allocation', 'Oil and gas distribution', 'CONFIDENTIAL', 6),
('energy', 'Grid Infrastructure', 'Power grid specifications', 'RESTRICTED', 7),
('information', 'Public Records', 'Government publications', 'PUBLIC', 8);

-- Insert test files
INSERT INTO files (record_id, filename, original_name, mime_type, size, path, uploaded_by) VALUES
(1, 'patient_data_2024.pdf', 'patient_data_2024.pdf', 'application/pdf', 1024, '/uploads/health/1/', 2),
(2, 'student_records.xlsx', 'student_records.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 2048, '/uploads/education/2/', 3),
(3, 'vehicle_registry.db', 'vehicle_registry.db', 'application/x-sqlite3', 4096, '/uploads/transport/3/', 4);

-- Insert test audit logs
INSERT INTO audit_logs (user_id, action, target_type, target_id, details, ip_address) VALUES
(1, 'LOGIN', 'USER', 1, 'Successful login', '10.0.0.1'),
(2, 'VIEW', 'RECORD', 1, 'Viewed patient records', '10.0.0.2'),
(3, 'EDIT', 'RECORD', 2, 'Updated student grades', '10.0.0.3'); 