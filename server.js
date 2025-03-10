// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { sendEmails } = require('./controllers/emailController');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const app = express();

// Detailed CORS configuration
const corsOptions = {
    origin: ['https://resume-sender.netlify.app', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400 // 24 hours
};

// Apply CORS configuration BEFORE other middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        console.log('Processing file:', file.originalname);
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        console.log('Received file:', {
            fieldname: file.fieldname,
            originalname: file.originalname,
            mimetype: file.mimetype
        });
        cb(null, true);
    }
}).fields([
    { name: 'resume', maxCount: 1 },
    { name: 'csv', maxCount: 1 }
]);

// File upload endpoint with CORS headers and error handling
app.post('/send-emails', (req, res) => {
    // Ensure CORS headers are set
    res.header('Access-Control-Allow-Origin', 'https://resume-sender.netlify.app');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    upload(req, res, async (err) => {
        if (err) {
            console.error('Multer error:', err);
            return res.status(500).json({
                success: false,
                message: 'File upload error',
                error: err.message
            });
        }

        try {
            console.log('Files received:', req.files);
            
            if (!req.files || !req.files.resume || !req.files.csv) {
                throw new Error('Missing required files');
            }

            await sendEmails(req, res);
        } catch (error) {
            console.error('Server error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error occurred',
                error: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    });
});

// Handle preflight requests
app.options('/send-emails', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'https://resume-sender.netlify.app');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).send();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({
        success: false,
        message: 'Server error occurred',
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Basic security headers
app.use((req, res, next) => {
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    res.header('X-XSS-Protection', '1; mode=block');
    next();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Uploads directory: ${uploadsDir}`);
    console.log('CORS enabled for:', corsOptions.origin);
});