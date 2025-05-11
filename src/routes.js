const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('./auth/middleware');
const authRoutes = require('./auth/routes');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Import ministry routes
const healthRoutes = require('./ministries/health/routes');
const educationRoutes = require('./ministries/education/routes');
const transportRoutes = require('./ministries/transport/routes');
const interiorRoutes = require('./ministries/interior/routes');
const petroleumRoutes = require('./ministries/petroleum/routes');
const energyRoutes = require('./ministries/energy/routes');
const informationRoutes = require('./ministries/information/routes');

// Mount auth routes
router.use('/auth', authRoutes);

// Home route
router.get('/', (req, res) => {
    res.render('index', { 
        user: req.session.user || null,
        error: null
    });
});

// Mock records for each ministry
const mockRecords = {
    health: [
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            name: `Patient ${i + 1}`,
            status: ['Active', 'Discharged', 'Under Observation', 'Critical'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Medical Record',
                department: ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Oncology'][Math.floor(Math.random() * 5)],
                doctor: `Dr. ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)]}`,
                admission_date: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                diagnosis: ['Hypertension', 'Diabetes', 'Asthma', 'Arthritis', 'Cancer'][Math.floor(Math.random() * 5)],
                treatment: ['Medication', 'Surgery', 'Therapy', 'Observation', 'Rehabilitation'][Math.floor(Math.random() * 5)]
            }
        })),
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 26,
            name: `Facility ${i + 1}`,
            status: ['Operational', 'Under Maintenance', 'Closed', 'Under Construction'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Hospital Record',
                department: ['Emergency', 'Surgery', 'ICU', 'Outpatient', 'Laboratory'][Math.floor(Math.random() * 5)],
                capacity: Math.floor(Math.random() * 500) + 100,
                equipment: ['MRI', 'CT Scanner', 'X-Ray', 'Ultrasound', 'ECG'][Math.floor(Math.random() * 5)],
                staff_count: Math.floor(Math.random() * 200) + 50,
                last_inspection: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }
        })),
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 51,
            name: `Research ${i + 1}`,
            status: ['Active', 'Completed', 'Under Review', 'Published'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Medical Research',
                department: ['Clinical Trials', 'Drug Development', 'Disease Prevention', 'Treatment Research', 'Vaccine Development'][Math.floor(Math.random() * 5)],
                researcher: `Dr. ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)]}`,
                start_date: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                funding: Math.floor(Math.random() * 1000000) + 10000,
                participants: Math.floor(Math.random() * 1000) + 100
            }
        }))
    ],
    education: [
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            name: `Student ${i + 1}`,
            status: ['Enrolled', 'Graduated', 'On Leave', 'Suspended'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Student Record',
                department: ['Computer Science', 'Engineering', 'Business', 'Arts', 'Medicine'][Math.floor(Math.random() * 5)],
                grade: ['A', 'B', 'C', 'D', 'F'][Math.floor(Math.random() * 5)],
                enrollment_date: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                courses: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science'][Math.floor(Math.random() * 5)]
            }
        })),
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 26,
            name: `School ${i + 1}`,
            status: ['Active', 'Under Construction', 'Closed', 'Under Review'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Institution Record',
                department: ['Primary', 'Secondary', 'Higher Education', 'Vocational', 'Special Education'][Math.floor(Math.random() * 5)],
                location: ['Urban', 'Suburban', 'Rural'][Math.floor(Math.random() * 3)],
                student_count: Math.floor(Math.random() * 2000) + 500,
                staff_count: Math.floor(Math.random() * 200) + 50,
                facilities: ['Library', 'Laboratory', 'Sports Complex', 'Auditorium', 'Computer Lab'][Math.floor(Math.random() * 5)]
            }
        })),
        ...Array.from({ length: 30 }, (_, i) => ({
            id: i + 51,
            name: `Program ${i + 1}`,
            status: ['Active', 'Completed', 'Under Review', 'Planned'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Educational Program',
                department: ['Curriculum Development', 'Teacher Training', 'Student Support', 'Research', 'International Exchange'][Math.floor(Math.random() * 5)],
                coordinator: `Prof. ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)]}`,
                start_date: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                budget: Math.floor(Math.random() * 1000000) + 10000,
                participants: Math.floor(Math.random() * 1000) + 100
            }
        }))
    ],
    transport: [
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            name: `Vehicle ${i + 1}`,
            status: ['Active', 'Maintenance', 'Retired', 'Under Repair'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Vehicle Record',
                department: ['Public Transport', 'Fleet Management', 'Infrastructure', 'Safety', 'Maintenance'][Math.floor(Math.random() * 5)],
                vehicle_type: ['Bus', 'Train', 'Tram', 'Taxi', 'Ambulance'][Math.floor(Math.random() * 5)],
                registration_date: new Date(Date.now() - Math.floor(Math.random() * 730) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                last_service: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }
        })),
        ...Array.from({ length: 20 }, (_, i) => ({
            id: i + 26,
            name: `Route ${i + 1}`,
            status: ['Active', 'Under Construction', 'Closed', 'Under Review'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Transport Route',
                department: ['Urban Transport', 'Intercity Transport', 'Rail Transport', 'Air Transport', 'Maritime Transport'][Math.floor(Math.random() * 5)],
                route_type: ['Bus Route', 'Train Line', 'Flight Path', 'Shipping Lane', 'Highway'][Math.floor(Math.random() * 5)],
                distance: Math.floor(Math.random() * 1000) + 10,
                daily_traffic: Math.floor(Math.random() * 10000) + 1000,
                maintenance_schedule: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually'][Math.floor(Math.random() * 5)]
            }
        })),
        ...Array.from({ length: 20 }, (_, i) => ({
            id: i + 46,
            name: `Infrastructure ${i + 1}`,
            status: ['Operational', 'Under Construction', 'Maintenance', 'Planned'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Transport Infrastructure',
                department: ['Roads', 'Bridges', 'Tunnels', 'Ports', 'Airports'][Math.floor(Math.random() * 5)],
                location: ['Urban', 'Suburban', 'Rural', 'Coastal', 'Mountain'][Math.floor(Math.random() * 5)],
                construction_date: new Date(Date.now() - Math.floor(Math.random() * 3650) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                capacity: Math.floor(Math.random() * 10000) + 1000,
                last_inspection: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }
        }))
    ],
    interior: [
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            name: `Facility ${i + 1}`,
            status: ['Operational', 'Under Construction', 'Closed', 'Maintenance'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Facility Record',
                department: ['Security', 'Maintenance', 'Administration', 'Operations', 'Safety'][Math.floor(Math.random() * 5)],
                location: ['Capital City', 'North Region', 'South Region', 'East Region', 'West Region'][Math.floor(Math.random() * 5)],
                construction_date: new Date(Date.now() - Math.floor(Math.random() * 3650) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                capacity: Math.floor(Math.random() * 1000) + 100
            }
        })),
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 26,
            name: `Security ${i + 1}`,
            status: ['Active', 'Under Review', 'Suspended', 'Completed'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Security Operation',
                department: ['Border Security', 'Internal Security', 'Emergency Response', 'Intelligence', 'Law Enforcement'][Math.floor(Math.random() * 5)],
                location: ['Border', 'Urban', 'Rural', 'Coastal', 'Airport'][Math.floor(Math.random() * 5)],
                personnel_count: Math.floor(Math.random() * 1000) + 100,
                equipment: ['Surveillance', 'Communication', 'Transport', 'Weapons', 'Protection'][Math.floor(Math.random() * 5)],
                last_drill: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }
        })),
        ...Array.from({ length: 20 }, (_, i) => ({
            id: i + 51,
            name: `Emergency ${i + 1}`,
            status: ['Active', 'Resolved', 'Under Control', 'Escalating'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Emergency Response',
                department: ['Disaster Management', 'Search and Rescue', 'Medical Emergency', 'Fire Response', 'Evacuation'][Math.floor(Math.random() * 5)],
                location: ['Urban', 'Rural', 'Coastal', 'Mountain', 'Industrial'][Math.floor(Math.random() * 5)],
                severity: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)],
                response_team: Math.floor(Math.random() * 100) + 10,
                start_time: new Date(Date.now() - Math.floor(Math.random() * 24) * 60 * 60 * 1000).toISOString()
            }
        }))
    ],
    petroleum: [
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            name: `Well ${i + 1}`,
            status: ['Active', 'Inactive', 'Under Maintenance', 'Abandoned'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Well Record',
                department: ['Exploration', 'Production', 'Maintenance', 'Safety', 'Environmental'][Math.floor(Math.random() * 5)],
                location: ['Offshore', 'Onshore', 'Deep Water', 'Shallow Water', 'Arctic'][Math.floor(Math.random() * 5)],
                production_capacity: Math.floor(Math.random() * 10000) + 1000,
                last_inspection: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }
        })),
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 26,
            name: `Refinery ${i + 1}`,
            status: ['Operational', 'Maintenance', 'Shutdown', 'Under Construction'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Refinery Record',
                department: ['Processing', 'Storage', 'Distribution', 'Quality Control', 'Safety'][Math.floor(Math.random() * 5)],
                capacity: Math.floor(Math.random() * 100000) + 10000,
                products: ['Gasoline', 'Diesel', 'Jet Fuel', 'LPG', 'Asphalt'][Math.floor(Math.random() * 5)],
                last_audit: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                safety_rating: (Math.random() * 5).toFixed(1)
            }
        })),
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 51,
            name: `Pipeline ${i + 1}`,
            status: ['Active', 'Maintenance', 'Under Construction', 'Decommissioned'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Pipeline Record',
                department: ['Transportation', 'Maintenance', 'Safety', 'Environmental', 'Operations'][Math.floor(Math.random() * 5)],
                length: Math.floor(Math.random() * 1000) + 10,
                diameter: Math.floor(Math.random() * 100) + 10,
                pressure: Math.floor(Math.random() * 1000) + 100,
                last_inspection: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }
        }))
    ],
    energy: [
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            name: `Plant ${i + 1}`,
            status: ['Operational', 'Maintenance', 'Offline', 'Under Construction'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Power Plant Record',
                department: ['Generation', 'Distribution', 'Maintenance', 'Safety', 'Environmental'][Math.floor(Math.random() * 5)],
                plant_type: ['Nuclear', 'Coal', 'Hydro', 'Solar', 'Wind'][Math.floor(Math.random() * 5)],
                capacity_mw: Math.floor(Math.random() * 1000) + 100,
                last_maintenance: new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }
        })),
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 26,
            name: `Grid ${i + 1}`,
            status: ['Active', 'Maintenance', 'Upgrade', 'Under Construction'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Grid Record',
                department: ['Transmission', 'Distribution', 'Maintenance', 'Safety', 'Operations'][Math.floor(Math.random() * 5)],
                voltage: Math.floor(Math.random() * 1000) + 100,
                coverage_area: Math.floor(Math.random() * 10000) + 1000,
                substations: Math.floor(Math.random() * 100) + 10,
                last_upgrade: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }
        })),
        ...Array.from({ length: 10 }, (_, i) => ({
            id: i + 51,
            name: `Project ${i + 1}`,
            status: ['Active', 'Completed', 'Under Review', 'Planned'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Energy Project',
                department: ['Renewable Energy', 'Grid Modernization', 'Energy Storage', 'Smart Grid', 'Research'][Math.floor(Math.random() * 5)],
                budget: Math.floor(Math.random() * 10000000) + 100000,
                duration_months: Math.floor(Math.random() * 36) + 12,
                partners: ['Government', 'Private Sector', 'Research Institutions', 'International Organizations', 'Local Communities'][Math.floor(Math.random() * 5)],
                start_date: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }
        }))
    ],
    information: [
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            name: `News Item ${i + 1}`,
            status: ['Published', 'Draft', 'Under Review', 'Archived'][Math.floor(Math.random() * 4)],
            details: {
                type: 'News Record',
                department: ['Politics', 'Economy', 'Society', 'Technology', 'International'][Math.floor(Math.random() * 5)],
                category: ['Breaking', 'Feature', 'Analysis', 'Opinion', 'Report'][Math.floor(Math.random() * 5)],
                publish_date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                author: `Reporter ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)]}`
            }
        })),
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 26,
            name: `Broadcast ${i + 1}`,
            status: ['Live', 'Recorded', 'Scheduled', 'Archived'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Broadcast Record',
                department: ['TV', 'Radio', 'Online', 'Social Media', 'Press'][Math.floor(Math.random() * 5)],
                format: ['News', 'Documentary', 'Interview', 'Panel Discussion', 'Report'][Math.floor(Math.random() * 5)],
                duration: Math.floor(Math.random() * 120) + 30,
                audience_reach: Math.floor(Math.random() * 1000000) + 10000,
                broadcast_date: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }
        })),
        ...Array.from({ length: 40 }, (_, i) => ({
            id: i + 51,
            name: `Publication ${i + 1}`,
            status: ['Published', 'In Press', 'Under Review', 'Archived'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Publication Record',
                department: ['Print', 'Digital', 'Research', 'Archives', 'Library'][Math.floor(Math.random() * 5)],
                category: ['Government Report', 'Research Paper', 'Policy Brief', 'Annual Review', 'Special Publication'][Math.floor(Math.random() * 5)],
                language: ['English', 'French', 'Spanish', 'Arabic', 'Chinese'][Math.floor(Math.random() * 5)],
                pages: Math.floor(Math.random() * 500) + 50,
                publication_date: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }
        }))
    ],
    agriculture: [
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            name: `Farm ${i + 1}`,
            status: ['Active', 'Inactive', 'Under Development', 'Seasonal'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Farm Record',
                department: ['Crops', 'Livestock', 'Research', 'Development', 'Marketing'][Math.floor(Math.random() * 5)],
                farm_type: ['Crop', 'Livestock', 'Mixed', 'Organic', 'Research'][Math.floor(Math.random() * 5)],
                size_hectares: Math.floor(Math.random() * 1000) + 10,
                last_harvest: new Date(Date.now() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }
        })),
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 26,
            name: `Research ${i + 1}`,
            status: ['Active', 'Completed', 'Under Review', 'Published'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Agricultural Research',
                department: ['Crop Science', 'Animal Science', 'Soil Science', 'Pest Management', 'Biotechnology'][Math.floor(Math.random() * 5)],
                researcher: `Dr. ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)]}`,
                start_date: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                funding: Math.floor(Math.random() * 1000000) + 10000,
                location: ['Research Center', 'Field Station', 'Laboratory', 'Greenhouse', 'Farm'][Math.floor(Math.random() * 5)]
            }
        })),
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 51,
            name: `Project ${i + 1}`,
            status: ['Active', 'Completed', 'Under Review', 'Planned'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Agricultural Project',
                department: ['Irrigation', 'Equipment', 'Storage', 'Processing', 'Distribution'][Math.floor(Math.random() * 5)],
                budget: Math.floor(Math.random() * 1000000) + 10000,
                duration_months: Math.floor(Math.random() * 36) + 12,
                beneficiaries: Math.floor(Math.random() * 1000) + 100,
                location: ['Rural', 'Urban', 'Coastal', 'Mountain', 'Plains'][Math.floor(Math.random() * 5)]
            }
        }))
    ],
    commerce: [
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            name: `Business ${i + 1}`,
            status: ['Active', 'Inactive', 'Under Review', 'Suspended'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Business Record',
                department: ['Registration', 'Compliance', 'Development', 'International', 'Domestic'][Math.floor(Math.random() * 5)],
                business_type: ['Retail', 'Manufacturing', 'Service', 'Technology', 'Agriculture'][Math.floor(Math.random() * 5)],
                registration_date: new Date(Date.now() - Math.floor(Math.random() * 3650) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                annual_revenue: Math.floor(Math.random() * 1000000) + 10000
            }
        })),
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 26,
            name: `Trade ${i + 1}`,
            status: ['Active', 'Completed', 'Under Review', 'Suspended'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Trade Record',
                department: ['Import', 'Export', 'Domestic', 'International', 'Special Economic Zone'][Math.floor(Math.random() * 5)],
                trade_type: ['Goods', 'Services', 'Technology', 'Agriculture', 'Manufacturing'][Math.floor(Math.random() * 5)],
                value: Math.floor(Math.random() * 10000000) + 100000,
                partner_country: ['USA', 'UK', 'China', 'Russia', 'France'][Math.floor(Math.random() * 5)],
                start_date: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }
        })),
        ...Array.from({ length: 30 }, (_, i) => ({
            id: i + 51,
            name: `Market ${i + 1}`,
            status: ['Active', 'Under Construction', 'Closed', 'Planned'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Market Record',
                department: ['Wholesale', 'Retail', 'Specialty', 'International', 'Local'][Math.floor(Math.random() * 5)],
                location: ['Urban', 'Suburban', 'Rural', 'Coastal', 'Mountain'][Math.floor(Math.random() * 5)],
                size_sqm: Math.floor(Math.random() * 10000) + 1000,
                vendor_count: Math.floor(Math.random() * 1000) + 100,
                daily_visitors: Math.floor(Math.random() * 10000) + 1000
            }
        }))
    ],
    defense: [
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            name: `Unit ${i + 1}`,
            status: ['Active', 'Reserve', 'Training', 'Deployed'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Military Record',
                department: ['Army', 'Navy', 'Air Force', 'Special Forces', 'Support'][Math.floor(Math.random() * 5)],
                unit_type: ['Infantry', 'Artillery', 'Armor', 'Aviation', 'Support'][Math.floor(Math.random() * 5)],
                location: ['Base A', 'Base B', 'Base C', 'Base D', 'Base E'][Math.floor(Math.random() * 5)],
                personnel_count: Math.floor(Math.random() * 1000) + 100
            }
        })),
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 26,
            name: `Equipment ${i + 1}`,
            status: ['Active', 'Maintenance', 'Retired', 'Under Repair'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Equipment Record',
                department: ['Army', 'Navy', 'Air Force', 'Special Forces', 'Support'][Math.floor(Math.random() * 5)],
                equipment_type: ['Vehicle', 'Aircraft', 'Vessel', 'Weapon', 'Communication'][Math.floor(Math.random() * 5)],
                acquisition_date: new Date(Date.now() - Math.floor(Math.random() * 3650) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                last_maintenance: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                condition: ['Excellent', 'Good', 'Fair', 'Poor', 'Critical'][Math.floor(Math.random() * 5)]
            }
        })),
        ...Array.from({ length: 20 }, (_, i) => ({
            id: i + 51,
            name: `Operation ${i + 1}`,
            status: ['Active', 'Completed', 'Planned', 'Cancelled'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Operation Record',
                department: ['Combat', 'Training', 'Support', 'Intelligence', 'Logistics'][Math.floor(Math.random() * 5)],
                location: ['Domestic', 'International', 'Training Ground', 'Base', 'Field'][Math.floor(Math.random() * 5)],
                start_date: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                personnel_involved: Math.floor(Math.random() * 1000) + 100,
                priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)]
            }
        }))
    ],
    environment: [
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            name: `Project ${i + 1}`,
            status: ['Active', 'Completed', 'Under Review', 'Planned'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Environmental Record',
                department: ['Conservation', 'Pollution Control', 'Research', 'Policy', 'Compliance'][Math.floor(Math.random() * 5)],
                project_type: ['Conservation', 'Cleanup', 'Research', 'Education', 'Policy'][Math.floor(Math.random() * 5)],
                start_date: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                budget: Math.floor(Math.random() * 1000000) + 10000
            }
        })),
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 26,
            name: `Site ${i + 1}`,
            status: ['Protected', 'Under Threat', 'Restored', 'Under Monitoring'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Protected Area',
                department: ['Wildlife', 'Forest', 'Marine', 'Wetland', 'Heritage'][Math.floor(Math.random() * 5)],
                location: ['Forest', 'Coast', 'Mountain', 'Desert', 'Wetland'][Math.floor(Math.random() * 5)],
                size_hectares: Math.floor(Math.random() * 10000) + 1000,
                species_count: Math.floor(Math.random() * 1000) + 100,
                last_survey: new Date(Date.now() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }
        })),
        ...Array.from({ length: 15 }, (_, i) => ({
            id: i + 51,
            name: `Research ${i + 1}`,
            status: ['Active', 'Completed', 'Under Review', 'Published'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Environmental Research',
                department: ['Climate', 'Biodiversity', 'Pollution', 'Conservation', 'Sustainability'][Math.floor(Math.random() * 5)],
                researcher: `Dr. ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)]}`,
                start_date: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                funding: Math.floor(Math.random() * 1000000) + 10000,
                location: ['Field', 'Laboratory', 'Reserve', 'Urban', 'Remote'][Math.floor(Math.random() * 5)]
            }
        }))
    ],
    finance: [
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            name: `Transaction ${i + 1}`,
            status: ['Completed', 'Pending', 'Failed', 'Under Review'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Financial Record',
                department: ['Treasury', 'Taxation', 'Budget', 'Investment', 'Audit'][Math.floor(Math.random() * 5)],
                transaction_type: ['Revenue', 'Expense', 'Investment', 'Loan', 'Grant'][Math.floor(Math.random() * 5)],
                amount: Math.floor(Math.random() * 1000000) + 1000,
                date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }
        })),
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 26,
            name: `Budget ${i + 1}`,
            status: ['Active', 'Approved', 'Under Review', 'Archived'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Budget Record',
                department: ['Ministry', 'Department', 'Project', 'Program', 'Initiative'][Math.floor(Math.random() * 5)],
                fiscal_year: new Date().getFullYear(),
                total_amount: Math.floor(Math.random() * 10000000) + 100000,
                allocation: {
                    operations: Math.floor(Math.random() * 40) + 20,
                    development: Math.floor(Math.random() * 40) + 20,
                    maintenance: Math.floor(Math.random() * 20) + 10,
                    emergency: Math.floor(Math.random() * 20) + 10
                },
                approval_date: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }
        })),
        ...Array.from({ length: 35 }, (_, i) => ({
            id: i + 51,
            name: `Audit ${i + 1}`,
            status: ['Completed', 'In Progress', 'Scheduled', 'Under Review'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Audit Record',
                department: ['Internal', 'External', 'Special', 'Compliance', 'Performance'][Math.floor(Math.random() * 5)],
                auditor: `Auditor ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)]}`,
                start_date: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                findings: Math.floor(Math.random() * 50) + 1,
                risk_level: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)]
            }
        }))
    ],
    foreign: [
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            name: `Diplomatic ${i + 1}`,
            status: ['Active', 'Completed', 'Under Review', 'Pending'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Diplomatic Record',
                department: ['Bilateral', 'Multilateral', 'Consular', 'Cultural', 'Economic'][Math.floor(Math.random() * 5)],
                country: ['USA', 'UK', 'China', 'Russia', 'France'][Math.floor(Math.random() * 5)],
                start_date: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)]
            }
        })),
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 26,
            name: `Mission ${i + 1}`,
            status: ['Active', 'Completed', 'Planned', 'Cancelled'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Diplomatic Mission',
                department: ['Embassy', 'Consulate', 'Trade Office', 'Cultural Center', 'Development Office'][Math.floor(Math.random() * 5)],
                location: ['Capital', 'Major City', 'Port City', 'Border City', 'Special Zone'][Math.floor(Math.random() * 5)],
                staff_count: Math.floor(Math.random() * 100) + 10,
                start_date: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                budget: Math.floor(Math.random() * 1000000) + 10000
            }
        })),
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 51,
            name: `Agreement ${i + 1}`,
            status: ['Active', 'Expired', 'Under Review', 'Pending'][Math.floor(Math.random() * 4)],
            details: {
                type: 'International Agreement',
                department: ['Trade', 'Defense', 'Culture', 'Education', 'Technology'][Math.floor(Math.random() * 5)],
                partner_countries: ['USA', 'UK', 'China', 'Russia', 'France'][Math.floor(Math.random() * 5)],
                signing_date: new Date(Date.now() - Math.floor(Math.random() * 3650) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                duration_years: Math.floor(Math.random() * 20) + 1,
                status: ['Active', 'Expired', 'Under Review', 'Pending Renewal'][Math.floor(Math.random() * 4)]
            }
        }))
    ],
    justice: [
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            name: `Case ${i + 1}`,
            status: ['Active', 'Closed', 'Appealed', 'Under Review'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Legal Record',
                department: ['Criminal', 'Civil', 'Family', 'Corporate', 'Constitutional'][Math.floor(Math.random() * 5)],
                case_type: ['Criminal', 'Civil', 'Family', 'Corporate', 'Constitutional'][Math.floor(Math.random() * 5)],
                filing_date: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                judge: `Judge ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)]}`
            }
        })),
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 26,
            name: `Facility ${i + 1}`,
            status: ['Operational', 'Under Construction', 'Closed', 'Under Review'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Correctional Facility',
                department: ['Prison', 'Detention Center', 'Rehabilitation Center', 'Juvenile Facility', 'Work Release Center'][Math.floor(Math.random() * 5)],
                location: ['Urban', 'Suburban', 'Rural', 'Remote', 'Island'][Math.floor(Math.random() * 5)],
                capacity: Math.floor(Math.random() * 1000) + 100,
                staff_count: Math.floor(Math.random() * 200) + 50,
                security_level: ['Minimum', 'Medium', 'Maximum', 'Super Maximum'][Math.floor(Math.random() * 4)]
            }
        })),
        ...Array.from({ length: 30 }, (_, i) => ({
            id: i + 51,
            name: `Program ${i + 1}`,
            status: ['Active', 'Completed', 'Under Review', 'Planned'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Justice Program',
                department: ['Rehabilitation', 'Probation', 'Parole', 'Community Service', 'Education'][Math.floor(Math.random() * 5)],
                coordinator: `Officer ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)]}`,
                start_date: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                participants: Math.floor(Math.random() * 1000) + 100,
                success_rate: Math.floor(Math.random() * 100) + 1
            }
        }))
    ],
    labor: [
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            name: `Employment ${i + 1}`,
            status: ['Active', 'Terminated', 'On Leave', 'Under Review'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Employment Record',
                department: ['Public Service', 'Private Sector', 'Unemployment', 'Training', 'Compliance'][Math.floor(Math.random() * 5)],
                position: ['Manager', 'Specialist', 'Analyst', 'Coordinator', 'Assistant'][Math.floor(Math.random() * 5)],
                start_date: new Date(Date.now() - Math.floor(Math.random() * 3650) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                salary: Math.floor(Math.random() * 100000) + 30000
            }
        })),
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 26,
            name: `Training ${i + 1}`,
            status: ['Active', 'Completed', 'Scheduled', 'Cancelled'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Training Program',
                department: ['Vocational', 'Professional', 'Technical', 'Safety', 'Management'][Math.floor(Math.random() * 5)],
                instructor: `Trainer ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)]}`,
                start_date: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                participants: Math.floor(Math.random() * 100) + 10,
                duration_weeks: Math.floor(Math.random() * 12) + 1
            }
        })),
        ...Array.from({ length: 20 }, (_, i) => ({
            id: i + 51,
            name: `Inspection ${i + 1}`,
            status: ['Completed', 'In Progress', 'Scheduled', 'Under Review'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Workplace Inspection',
                department: ['Safety', 'Health', 'Compliance', 'Working Conditions', 'Child Labor'][Math.floor(Math.random() * 5)],
                inspector: `Inspector ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)]}`,
                inspection_date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                findings: Math.floor(Math.random() * 20) + 1,
                compliance_rate: Math.floor(Math.random() * 100) + 1
            }
        }))
    ],
    science: [
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            name: `Research ${i + 1}`,
            status: ['Active', 'Completed', 'Under Review', 'Published'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Research Record',
                department: ['Physics', 'Chemistry', 'Biology', 'Technology', 'Medicine'][Math.floor(Math.random() * 5)],
                research_type: ['Basic', 'Applied', 'Clinical', 'Experimental', 'Theoretical'][Math.floor(Math.random() * 5)],
                start_date: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                funding: Math.floor(Math.random() * 1000000) + 10000
            }
        })),
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 26,
            name: `Facility ${i + 1}`,
            status: ['Operational', 'Under Construction', 'Closed', 'Under Review'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Research Facility',
                department: ['Laboratory', 'Observatory', 'Research Center', 'Testing Facility', 'Data Center'][Math.floor(Math.random() * 5)],
                location: ['Urban', 'Suburban', 'Rural', 'Remote', 'Special Zone'][Math.floor(Math.random() * 5)],
                equipment_value: Math.floor(Math.random() * 10000000) + 100000,
                staff_count: Math.floor(Math.random() * 200) + 50,
                security_level: ['Standard', 'Enhanced', 'High', 'Maximum'][Math.floor(Math.random() * 4)]
            }
        })),
        ...Array.from({ length: 15 }, (_, i) => ({
            id: i + 51,
            name: `Project ${i + 1}`,
            status: ['Active', 'Completed', 'Under Review', 'Planned'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Science Project',
                department: ['Space', 'Nuclear', 'Climate', 'Biotechnology', 'Artificial Intelligence'][Math.floor(Math.random() * 5)],
                coordinator: `Dr. ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)]}`,
                start_date: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                budget: Math.floor(Math.random() * 10000000) + 100000,
                partners: ['Government', 'University', 'Industry', 'International', 'Military'][Math.floor(Math.random() * 5)]
            }
        }))
    ],
    tourism: [
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            name: `Destination ${i + 1}`,
            status: ['Active', 'Under Development', 'Closed', 'Seasonal'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Tourism Record',
                department: ['Promotion', 'Development', 'Heritage', 'Ecotourism', 'Cultural'][Math.floor(Math.random() * 5)],
                destination_type: ['Beach', 'Mountain', 'City', 'Cultural', 'Adventure'][Math.floor(Math.random() * 5)],
                annual_visitors: Math.floor(Math.random() * 100000) + 1000,
                rating: (Math.random() * 5).toFixed(1)
            }
        })),
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 26,
            name: `Event ${i + 1}`,
            status: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Tourism Event',
                department: ['Cultural', 'Sports', 'Business', 'Entertainment', 'Festival'][Math.floor(Math.random() * 5)],
                location: ['City', 'Beach', 'Mountain', 'Historic Site', 'Resort'][Math.floor(Math.random() * 5)],
                start_date: new Date(Date.now() + Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                expected_visitors: Math.floor(Math.random() * 10000) + 1000,
                budget: Math.floor(Math.random() * 1000000) + 10000
            }
        })),
        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 51,
            name: `Facility ${i + 1}`,
            status: ['Operational', 'Under Construction', 'Closed', 'Under Review'][Math.floor(Math.random() * 4)],
            details: {
                type: 'Tourism Facility',
                department: ['Hotel', 'Resort', 'Museum', 'Park', 'Entertainment'][Math.floor(Math.random() * 5)],
                location: ['Urban', 'Coastal', 'Mountain', 'Historic', 'Natural'][Math.floor(Math.random() * 5)],
                capacity: Math.floor(Math.random() * 1000) + 100,
                rating: (Math.random() * 5).toFixed(1),
                annual_revenue: Math.floor(Math.random() * 10000000) + 100000
            }
        }))
    ]
};

// Add sensitive data to all records
const addSensitiveData = (record, ministry) => {
    // Real-world document reference formats
    const documentFormats = {
        health: ['MED-', 'PAT-', 'HOS-', 'RES-'],
        education: ['EDU-', 'STU-', 'SCH-', 'PROG-'],
        transport: ['TRN-', 'VEH-', 'INF-', 'RT-'],
        interior: ['INT-', 'SEC-', 'EMR-', 'FAC-'],
        petroleum: ['PET-', 'WEL-', 'REF-', 'PIP-'],
        energy: ['NRG-', 'PWR-', 'GRD-', 'PRJ-'],
        information: ['INF-', 'NEWS-', 'BRD-', 'PUB-'],
        agriculture: ['AGR-', 'FARM-', 'CROP-', 'RES-'],
        commerce: ['COM-', 'BUS-', 'TRD-', 'LIC-'],
        defense: ['DEF-', 'SEC-', 'OPS-', 'EQP-'],
        environment: ['ENV-', 'POL-', 'CON-', 'RES-'],
        finance: ['FIN-', 'TAX-', 'BUD-', 'AUD-'],
        foreign: ['FOR-', 'DIP-', 'VIS-', 'TRE-'],
        justice: ['JUS-', 'CASE-', 'LEG-', 'DOC-'],
        labor: ['LAB-', 'EMP-', 'UNI-', 'INS-'],
        science: ['SCI-', 'RES-', 'TECH-', 'DEV-'],
        tourism: ['TOUR-', 'HOT-', 'EVT-', 'PRO-']
    };

    // Real-world government classification levels
    const classificationLevels = {
        PUBLIC: {
            level: 1,
            color: 'green',
            description: 'Information available to the general public'
        },
        INTERNAL: {
            level: 2,
            color: 'blue',
            description: 'For internal government use only'
        },
        RESTRICTED: {
            level: 3,
            color: 'yellow',
            description: 'Limited to authorized personnel'
        },
        CONFIDENTIAL: {
            level: 4,
            color: 'orange',
            description: 'Sensitive information requiring protection'
        },
        SECRET: {
            level: 5,
            color: 'red',
            description: 'Highly sensitive information'
        }
    };

    // Real-world government departments
    const departments = {
        health: ['Public Health', 'Medical Services', 'Research & Development', 'Emergency Response'],
        education: ['Primary Education', 'Higher Education', 'Research & Innovation', 'Student Affairs'],
        transport: ['Road Transport', 'Public Transit', 'Infrastructure', 'Safety & Regulation'],
        interior: ['Public Safety', 'Emergency Management', 'Facility Management', 'Security Operations'],
        petroleum: ['Exploration', 'Refining', 'Distribution', 'Regulation'],
        energy: ['Power Generation', 'Grid Management', 'Renewable Energy', 'Energy Policy'],
        information: ['Public Relations', 'Media Management', 'Digital Services', 'Archives'],
        agriculture: ['Crop Management', 'Livestock', 'Research', 'Rural Development'],
        commerce: ['Business Regulation', 'Trade Policy', 'Consumer Protection', 'Market Analysis'],
        defense: ['Military Operations', 'Intelligence', 'Equipment', 'Personnel'],
        environment: ['Conservation', 'Pollution Control', 'Climate Change', 'Natural Resources'],
        finance: ['Taxation', 'Budget Management', 'Audit', 'Economic Policy'],
        foreign: ['Diplomatic Relations', 'International Trade', 'Consular Services', 'Foreign Policy'],
        justice: ['Criminal Justice', 'Civil Law', 'Corrections', 'Legal Services'],
        labor: ['Employment Services', 'Workplace Safety', 'Labor Relations', 'Training'],
        science: ['Research & Development', 'Technology Innovation', 'Scientific Policy', 'Education'],
        tourism: ['Destination Management', 'Cultural Heritage', 'Marketing', 'Visitor Services']
    };

    // Real-world government locations
    const locations = {
        'Main Office': {
            address: '123 Government Square, Capital City',
            coordinates: '40.7128° N, 74.0060° W',
            security_level: 'HIGH'
        },
        'Branch Office': {
            address: '456 Regional Center, Regional City',
            coordinates: '34.0522° N, 118.2437° W',
            security_level: 'MEDIUM'
        },
        'Field Office': {
            address: '789 Local Center, Local City',
            coordinates: '41.8781° N, 87.6298° W',
            security_level: 'MEDIUM'
        },
        'Remote Site': {
            address: '321 Remote Facility, Remote Area',
            coordinates: '37.7749° N, 122.4194° W',
            security_level: 'LOW'
        },
        'Data Center': {
            address: '654 Secure Facility, Secure Location',
            coordinates: '38.9072° N, 77.0369° W',
            security_level: 'MAXIMUM'
        }
    };

    const selectedLocation = Object.keys(locations)[Math.floor(Math.random() * Object.keys(locations).length)];
    const selectedDepartment = departments[ministry][Math.floor(Math.random() * departments[ministry].length)];
    const selectedClassification = Object.keys(classificationLevels)[Math.floor(Math.random() * Object.keys(classificationLevels).length)];
    const docPrefix = documentFormats[ministry][Math.floor(Math.random() * documentFormats[ministry].length)];

    // Add SQL injection vulnerable fields
    const sqlVulnerableFields = {
        query: `SELECT * FROM ${ministry}_records WHERE id = '${record.id}'`,
        search: `name LIKE '%${record.title}%'`,
        filter: `department = '${selectedDepartment}'`,
        sort: `ORDER BY ${record.id}`,
        join: `JOIN ${ministry}_users ON ${ministry}_records.user_id = ${ministry}_users.id`
    };

    // Add IDOR vulnerable fields
    const idorVulnerableFields = {
        user_id: `USER-${Math.floor(Math.random() * 10000)}`,
        access_token: `tok_${Math.random().toString(36).substring(7)}`,
        session_id: `sess_${Math.random().toString(36).substring(7)}`,
        reference_id: `REF-${ministry.toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
        cross_references: {
            related_records: [
                `REC-${ministry.toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
                `REC-${ministry.toUpperCase()}-${Math.floor(Math.random() * 1000)}`
            ],
            parent_record: `PARENT-${ministry.toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
            child_records: [
                `CHILD-${ministry.toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
                `CHILD-${ministry.toUpperCase()}-${Math.floor(Math.random() * 1000)}`
            ]
        }
    };

    // Add file upload vulnerable fields
    const fileUploadVulnerableFields = {
        file_metadata: {
            original_name: `document_${record.id}.pdf`,
            stored_name: `${Math.random().toString(36).substring(7)}.pdf`,
            mime_type: 'application/pdf',
            size: Math.floor(Math.random() * 10000000),
            upload_path: `/uploads/${ministry}/${record.id}/`,
            backup_path: `/backups/${ministry}/${record.id}/`
        },
        file_references: [
            {
                name: `report_${record.id}.docx`,
                path: `/documents/${ministry}/reports/`,
                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            },
            {
                name: `data_${record.id}.xlsx`,
                path: `/documents/${ministry}/data/`,
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            },
            {
                name: `presentation_${record.id}.pptx`,
                path: `/documents/${ministry}/presentations/`,
                type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
            }
        ]
    };

    // Add command injection vulnerable fields
    const commandInjectionVulnerableFields = {
        system_commands: [
            `backup_${ministry}_data.sh`,
            `process_${ministry}_report.py`,
            `generate_${ministry}_stats.js`,
            `update_${ministry}_records.php`
        ],
        configuration: {
            backup_script: `/scripts/backup_${ministry}.sh`,
            process_script: `/scripts/process_${ministry}.py`,
            cron_job: `0 0 * * * /usr/bin/backup_${ministry}_data.sh`,
            system_path: `/var/www/${ministry}/scripts/`
        }
    };

    // Add sensitive data exposure fields
    const sensitiveDataFields = {
        credentials: {
            api_key: `sk_live_${ministry}_${Math.random().toString(36).substring(7)}`,
            secret_token: `sec_${ministry}_${Math.random().toString(36).substring(7)}`,
            access_token: `acc_${ministry}_${Math.random().toString(36).substring(7)}`,
            refresh_token: `ref_${ministry}_${Math.random().toString(36).substring(7)}`
        },
        personal_data: {
            employee_id: `EMP-${ministry.toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
            social_security: `XXX-XX-${Math.floor(Math.random() * 10000)}`,
            tax_id: `TAX-${Math.floor(Math.random() * 100000)}`,
            passport_number: `P${Math.floor(Math.random() * 1000000)}`
        },
        financial_data: {
            account_number: `ACC-${Math.floor(Math.random() * 1000000)}`,
            routing_number: `RT${Math.floor(Math.random() * 100000)}`,
            credit_card: `XXXX-XXXX-XXXX-${Math.floor(Math.random() * 10000)}`,
            transaction_id: `TXN-${Math.floor(Math.random() * 1000000)}`
        }
    };

    // Add authentication bypass fields
    const authBypassFields = {
        session_data: {
            session_id: `sess_${Math.random().toString(36).substring(7)}`,
            token: `tok_${Math.random().toString(36).substring(7)}`,
            expires_at: new Date(Date.now() + 86400000).toISOString(),
            refresh_token: `ref_${Math.random().toString(36).substring(7)}`
        },
        auth_headers: {
            'Authorization': `Bearer ${Math.random().toString(36).substring(7)}`,
            'X-API-Key': `key_${Math.random().toString(36).substring(7)}`,
            'X-CSRF-Token': `csrf_${Math.random().toString(36).substring(7)}`
        }
    };

    return {
        ...record,
        sensitive_data: {
            document_reference: `${docPrefix}${record.id.toString().padStart(6, '0')}`,
            classification: {
                level: selectedClassification,
                ...classificationLevels[selectedClassification]
            },
            department: {
                name: selectedDepartment,
                code: `${ministry.toUpperCase()}-${selectedDepartment.split(' ')[0].toUpperCase()}`,
                head: `Director of ${selectedDepartment}`,
                contact: `${selectedDepartment.toLowerCase().replace(/ /g, '.')}@${ministry}.gov`
            },
            location: {
                ...locations[selectedLocation],
                access_code: `ACCESS-${ministry.toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
                security_clearance_required: classificationLevels[selectedClassification].level >= 3
            },
            audit_trail: {
                created: {
                    timestamp: new Date(Date.now() - Math.floor(Math.random() * 31536000000)).toISOString(),
                    user: 'SYSTEM',
                    action: 'CREATE',
                    ip_address: `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
                    location: selectedLocation
                },
                modified: {
                    timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString(),
                    user: ['ADMIN', 'SYSTEM', 'AUTOMATED'][Math.floor(Math.random() * 3)],
                    action: 'UPDATE',
                    ip_address: `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
                    location: selectedLocation
                },
                access_history: Array.from({ length: 3 }, () => ({
                    timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString(),
                    user: ['ADMIN', 'USER', 'SYSTEM'][Math.floor(Math.random() * 3)],
                    action: ['VIEW', 'EDIT', 'EXPORT'][Math.floor(Math.random() * 3)],
                    ip_address: `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
                    location: selectedLocation
                }))
            },
            security: {
                encryption: {
                    algorithm: 'AES-256',
                    key_id: `KEY-${ministry.toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
                    last_rotated: new Date(Date.now() - Math.floor(Math.random() * 2592000000)).toISOString()
                },
                access_controls: {
                    roles: ['ADMIN', 'MANAGER', 'USER', 'VIEWER'],
                    permissions: ['READ', 'WRITE', 'DELETE', 'EXPORT'],
                    restrictions: ['NO_EXTERNAL_SHARING', 'NO_PRINTING', 'NO_DOWNLOAD']
                },
                compliance: {
                    retention_period: 365 * (Math.floor(Math.random() * 10) + 1),
                    regulatory_requirements: ['GDPR', 'HIPAA', 'ISO27001'],
                    audit_required: true
                }
            },
            system_references: {
                database: {
                    name: `${ministry}_records_db`,
                    table: `${ministry}_records`,
                    id: `DB-${ministry.toUpperCase()}-${record.id}`,
                    backup_path: `/backup/${ministry}/records/${record.id}`
                },
                file_system: {
                    path: `/var/www/records/${ministry}/${record.id}`,
                    permissions: '0644',
                    owner: 'www-data',
                    group: 'www-data'
                },
                api: {
                    endpoint: `/api/v1/${ministry}/records/${record.id}`,
                    key: `sk_live_${ministry}_${Math.random().toString(36).substring(7)}`,
                    version: '1.0.0'
                }
            },
            sql_vulnerable: sqlVulnerableFields,
            idor_vulnerable: idorVulnerableFields,
            file_upload_vulnerable: fileUploadVulnerableFields,
            command_injection_vulnerable: commandInjectionVulnerableFields,
            sensitive_data_exposure: sensitiveDataFields,
            auth_bypass_vulnerable: authBypassFields
        }
    };
};

// Update the mockRecords to include sensitive data
Object.keys(mockRecords).forEach(ministry => {
    mockRecords[ministry] = mockRecords[ministry].map(record => addSensitiveData(record, ministry));
});

// Records pages for each ministry
router.get('/api/:ministry/records', isAuthenticated, (req, res) => {
    const ministry = req.params.ministry;
    if (mockRecords[ministry]) {
        res.render('records', {
            ministry: ministry.charAt(0).toUpperCase() + ministry.slice(1),
            records: mockRecords[ministry],
            user: req.session.user
        });
    } else {
        res.status(404).send('Ministry not found');
    }
});

// Search endpoint (SQL Injection vulnerability)
router.get('/api/:ministry/search', isAuthenticated, (req, res) => {
    const ministry = req.params.ministry;
    const query = req.query.query;
    
    if (!mockRecords[ministry]) {
        return res.status(404).json({ error: 'Ministry not found' });
    }

    // Intentionally vulnerable to SQL injection
    const filteredRecords = mockRecords[ministry].filter(record => {
        return record.name.toLowerCase().includes(query.toLowerCase()) ||
               record.status.toLowerCase().includes(query.toLowerCase());
    });

    res.json(filteredRecords);
});

// Record details endpoint (IDOR vulnerability)
router.get('/api/:ministry/record/:id', isAuthenticated, (req, res) => {
    const ministry = req.params.ministry;
    const recordId = parseInt(req.params.id);
    
    if (!mockRecords[ministry]) {
        return res.status(404).json({ error: 'Ministry not found' });
    }

    const record = mockRecords[ministry].find(r => r.id === recordId);
    if (!record) {
        return res.status(404).json({ error: 'Record not found' });
    }

    // Add sensitive information to demonstrate IDOR vulnerability
    const sensitiveData = {
        internal_id: `INT-${ministry.toUpperCase()}-${recordId}`,
        access_level: 'RESTRICTED',
        last_modified: new Date().toISOString(),
        modified_by: 'admin',
        security_clearance: 'TOP SECRET',
        department: ministry.toUpperCase(),
        location: 'Main Office',
        contact: 'internal@vulngov.gov',
        backup_location: '/backup/records/' + recordId,
        system_path: '/var/www/records/' + recordId,
        database_id: `DB-${ministry.toUpperCase()}-${recordId}`,
        api_key: 'sk_live_' + Math.random().toString(36).substring(7),
        secret_token: 'secret_' + Math.random().toString(36).substring(7)
    };

    // Render the record details view with the combined data
    res.render('record-details', {
        ministry: ministry.charAt(0).toUpperCase() + ministry.slice(1),
        record: { ...record, ...sensitiveData },
        user: req.session.user
    });
});

// File upload endpoint (File upload vulnerability)
router.post('/api/:ministry/upload', isAuthenticated, (req, res) => {
    if (!req.files || !req.files.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.files.file;
    const uploadPath = path.join(__dirname, 'uploads', file.name);

    // Intentionally vulnerable - no file type validation
    file.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error uploading file' });
        }
        res.json({ message: 'File uploaded successfully' });
    });
});

// Command execution endpoint (Command injection vulnerability)
router.post('/api/:ministry/run', isAuthenticated, (req, res) => {
    const command = req.body.command;
    
    // Intentionally vulnerable to command injection
    exec(command, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json({ output: stdout });
    });
});

// Logs endpoint (Sensitive data exposure)
router.get('/api/:ministry/logs', isAuthenticated, (req, res) => {
    // Intentionally exposing sensitive logs
    const logs = [
        { timestamp: new Date(), level: 'INFO', message: 'System startup' },
        { timestamp: new Date(), level: 'ERROR', message: 'Database connection failed' },
        { timestamp: new Date(), level: 'DEBUG', message: 'User authentication successful' }
    ];
    res.json(logs);
});

// Create new record endpoint (NoSQL Injection vulnerability)
router.post('/api/:ministry/records', isAuthenticated, (req, res) => {
    const ministry = req.params.ministry;
    const newRecord = req.body;
    
    if (!mockRecords[ministry]) {
        return res.status(404).json({ error: 'Ministry not found' });
    }

    // Intentionally vulnerable to NoSQL injection
    // No input validation or sanitization
    newRecord.id = mockRecords[ministry].length + 1;
    mockRecords[ministry].push(newRecord);

    res.json({ message: 'Record created successfully', record: newRecord });
});

// Update record endpoint (IDOR vulnerability)
router.put('/api/:ministry/record/:id', isAuthenticated, (req, res) => {
    const ministry = req.params.ministry;
    const recordId = parseInt(req.params.id);
    const updates = req.body;
    
    if (!mockRecords[ministry]) {
        return res.status(404).json({ error: 'Ministry not found' });
    }

    // Intentionally vulnerable to IDOR - no authorization check
    const recordIndex = mockRecords[ministry].findIndex(r => r.id === recordId);
    if (recordIndex === -1) {
        return res.status(404).json({ error: 'Record not found' });
    }

    // No validation of updates
    mockRecords[ministry][recordIndex] = {
        ...mockRecords[ministry][recordIndex],
        ...updates
    };

    res.json({ message: 'Record updated successfully', record: mockRecords[ministry][recordIndex] });
});

// Delete record endpoint (IDOR vulnerability)
router.delete('/api/:ministry/record/:id', isAuthenticated, (req, res) => {
    const ministry = req.params.ministry;
    const recordId = parseInt(req.params.id);
    
    if (!mockRecords[ministry]) {
        return res.status(404).json({ error: 'Ministry not found' });
    }

    // Intentionally vulnerable to IDOR - no authorization check
    const recordIndex = mockRecords[ministry].findIndex(r => r.id === recordId);
    if (recordIndex === -1) {
        return res.status(404).json({ error: 'Record not found' });
    }

    // No validation before deletion
    const deletedRecord = mockRecords[ministry].splice(recordIndex, 1)[0];

    res.json({ message: 'Record deleted successfully', record: deletedRecord });
});

// Mount ministry API routes
router.use('/api/health', healthRoutes);
router.use('/api/education', educationRoutes);
router.use('/api/transport', transportRoutes);
router.use('/api/interior', interiorRoutes);
router.use('/api/petroleum', petroleumRoutes);
router.use('/api/energy', energyRoutes);
router.use('/api/information', informationRoutes);

// Dashboard route (protected)
router.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard', { 
        user: req.session.user,
        error: null
    });
});

module.exports = router; 