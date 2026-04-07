const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Utility/Middleware Imports
const logger = require('./utils/logger');
const errorRoute = require('./utils/errorRoute');

// Router Imports
const authRouter = require('./routes/authRouter');
const studentRouter = require('./routes/studentRoutes');
const companyRouter = require('./routes/companyRoutes');
const interviewRouter = require('./routes/interviewRoutes');
const applicationRouter = require('./routes/applicationRoutes');
const placementDriveRouter = require('./routes/placementDriveRoutes');
const jobRouter = require('./routes/jobRoutes');
const reportRouter = require('./routes/reportRouter');

const app = express();

// --- Middleware Configuration ---

// 1. CORS Configuration (Locked to local for security)
app.use(cors({
    origin: ['http://localhost:5173', 'campussarthi.netlify.app'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Replaced 'UPDATE' with 'PATCH'
    credentials: true
}));

// 2. Static Files (Access local uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 3. Essential Parsers
app.use(cookieParser());
app.use(express.json());

// 4. Request Logging
app.use(logger);

// --- API Routes ---

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/student', studentRouter);
app.use('/api/v1/company', companyRouter);
app.use('/api/v1/placementDrive', placementDriveRouter);
app.use('/api/v1/interview', interviewRouter);
app.use('/api/v1/application', applicationRouter);
app.use('/api/v1/job', jobRouter);
app.use('/api/v1/report', reportRouter);

// --- Error Handling ---
// Should always be the last middleware
app.use(errorRoute);

module.exports = app;
