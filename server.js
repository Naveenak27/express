// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const csv = require('csv-parser');

// Create uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const app = express();

// Enhanced CORS configuration
app.use(cors({
    origin: ['http://localhost:3000', 'https://express-2vzr.onrender.com'],
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Additional headers middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).json({ body: "OK" });
    }
    next();
});

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});

// Multer configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function(req, file, cb) {
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

app.use(express.json());

// Email sending function
const sendEmail = async (to, subject, html, attachments) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
        attachments
    };

    return transporter.sendMail(mailOptions);
};

// Main email sending endpoint
app.post('/send-emails', (req, res) => {
    console.log('Received request headers:', req.headers);
    
    upload(req, res, async (err) => {
        if (err) {
            console.error('Upload error:', err);
            return res.status(500).json({
                success: false,
                message: 'File upload error',
                error: err.message
            });
        }

        try {
            if (!req.files || !req.files.resume || !req.files.csv) {
                throw new Error('Missing required files');
            }

            const resumePath = req.files.resume[0].path;
            const csvPath = req.files.csv[0].path;
            
            const results = [];
            fs.createReadStream(csvPath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', async () => {
                    try {
                        for (const row of results) {
                            await sendEmail(
                                row.email,
                                'Job Application',
                                `<p>Please find attached resume.</p>`,
                                [{ path: resumePath }]
                            );
                        }

                        // Cleanup files
                        fs.unlinkSync(resumePath);
                        fs.unlinkSync(csvPath);

                        res.json({
                            success: true,
                            message: `Emails sent successfully to ${results.length} recipients`
                        });
                    } catch (error) {
                        console.error('Email sending error:', error);
                        res.status(500).json({
                            success: false,
                            message: 'Error sending emails',
                            error: error.message
                        });
                    }
                });
        } catch (error) {
            console.error('Server error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error occurred',
                error: error.message
            });
        }
    });
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

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Uploads directory: ${uploadsDir}`);
});
