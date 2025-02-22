const nodemailer = require('nodemailer');
let transporter;
const { parseCsv } = require('../utils/csvParser');
const fs = require('fs');

const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
        pool: true,
        maxConnections: 1,
        rateDelta: 15000,
        rateLimit: 15,
        secure: true
    });
};

const initializeEmail = async () => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
            throw new Error('Email credentials not configured');
        }

        transporter = createTransporter();
        await transporter.verify();
        console.log('Email server ready');
        return true;
    } catch (error) {
        console.error('Email configuration error:', error);
        return false;
    }
};





const createEmailContent = (recipientEmail, resumePath, resumeFilename) => {
    const senderName = process.env.SENDER_NAME || 'Your Name';
    const job = process.env.JOB || 'Frontend Developer';
    const companyName = process.env.COMPANY_NAME || 'Your Company';

    const messageId = `${Date.now()}.${Math.random().toString(36).substr(2)}.${process.env.EMAIL_USER}`;

    return {
        from: {
            name: senderName,
            address: process.env.EMAIL_USER
        },
        to: recipientEmail,
        subject: `Job Application - ${job}`,
        messageId: `<${messageId}>`,
        headers: {
            'List-Unsubscribe': `<mailto:${process.env.EMAIL_USER}?subject=unsubscribe>`,
            'Precedence': 'Bulk',
            'X-Auto-Response-Suppress': 'OOF, AutoReply',
            'X-Report-Abuse': `Please report abuse to: ${process.env.EMAIL_USER}`,
            'Feedback-ID': messageId
        },
        html: `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 680px; margin: 20px auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e8e8e8;">
    <div style="background: #2b3d4f; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 0.5px;">NAVEEN K</h1>
        <p style="color: #a0b3c6; margin: 8px 0 0; font-size: 14px;">Application for ${job}</p>
    </div>

    <div style="padding: 32px 40px;">
        <p style="color: #4a5568; margin: 0 0 20px; line-height: 1.6;">Dear Hiring Team,</p>
        
        <p style="color: #4a5568; margin: 0 0 20px; line-height: 1.6;">
            I am writing to apply for the ${job} position at your company. With my strong foundation in web development and focus on creating efficient, user-friendly applications, I am confident in my ability to make meaningful contributions to your projects.
        </p>

        <div style="border-left: 3px solid #2b3d4f; padding-left: 20px; margin: 20px 0;">
            <p style="color: #4a5568; margin: 0 0 16px; line-height: 1.6;">
                My technical expertise includes:
            </p>
            
            <ul style="margin: 0; padding: 0; list-style: none;">
                <li style="margin: 8px 0; padding-left: 24px; position: relative; color: #4a5568;">
                    <span style="position: absolute; left: 0; color: #2b3d4f;">▹</span>
                    Modern JavaScript (ES6+), and React ecosystem including Hooks and Context API
                </li>
                <li style="margin: 8px 0; padding-left: 24px; position: relative; color: #4a5568;">
                    <span style="position: absolute; left: 0; color: #2b3d4f;">▹</span>
                    State management with Redux Toolkit and experience with React Query for data fetching
                </li>
                <li style="margin: 8px 0; padding-left: 24px; position: relative; color: #4a5568;">
                    <span style="position: absolute; left: 0; color: #2b3d4f;">▹</span>
                    Modern CSS including Flexbox, Grid, and CSS-in-JS solutions (Styled Components)
                </li>
                <li style="margin: 8px 0; padding-left: 24px; position: relative; color: #4a5568;">
                    <span style="position: absolute; left: 0; color: #2b3d4f;">▹</span>
                    Web performance optimization, lazy loading, and code splitting techniques
                </li>
                <li style="margin: 8px 0; padding-left: 24px; position: relative; color: #4a5568;">
                    <span style="position: absolute; left: 0; color: #2b3d4f;">▹</span>
basic knowledge in node,experss and mysql
                    </li>
            </ul>
        </div>

        <p style="color: #4a5568; margin: 20px 0; line-height: 1.6;">
            I have successfully delivered responsive web applications with clean, maintainable code and excellent user experiences. My experience includes collaborating with cross-functional teams and implementing modern frontend architectures.
        </p>

        <p style="color: #4a5568; margin: 20px 0; line-height: 1.6;">
            Please let me know if you need any additional information about my background or experience. I look forward to discussing how I can contribute to your team's success.
        </p>

        <div style="margin-top: 32px; border-top: 1px solid #e8e8e8; padding-top: 24px;">
            <p style="margin: 0 0 8px; color: #4a5568;">
                Best regards,<br>
                <strong style="color: #2b3d4f;">${senderName}</strong>
            </p>
            <div style="margin-top: 12px;">
                <a href="mailto:${process.env.EMAIL_USER}" style="color: #3182ce; text-decoration: none; font-size: 14px; margin-right: 16px;">✉️ Email</a>
                <a href="${process.env.PORTFOLIO}" style="color: #3182ce; text-decoration: none; font-size: 14px;">🌐 Portfolio</a>
            </div>
        </div>
    </div>

    <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
        <p style="color: #718096; font-size: 12px; margin: 8px 0;">
            To opt out of future communications, please reply with "unsubscribe"
        </p>
    </div>




</div>      




`,
        text: `
Job Application: ${job} 

Dear Hiring Team,

I am writing to apply for the ${job} position at your company. With my strong foundation in web development and focus on creating efficient, user-friendly applications, I am confident in my ability to make meaningful contributions to your projects.

My technical expertise includes:
- Modern JavaScript (ES6+), TypeScript, and React ecosystem including Hooks and Context API
- State management with Redux Toolkit and experience with React Query for data fetching
- Modern CSS including Flexbox, Grid, and CSS-in-JS solutions (Styled Components, Tailwind)
- Web performance optimization, lazy loading, and code splitting techniques
- Experience with development tools including Webpack, Vite, and modern testing frameworks
- Familiarity with full-stack development patterns and RESTful architecture

I have successfully delivered responsive web applications with clean, maintainable code and excellent user experiences. My experience includes collaborating with cross-functional teams and implementing modern frontend architectures.

Please let me know if you need any additional information about my background or experience. I look forward to discussing how I can contribute to your team's success.

Best regards,
${senderName}
${process.env.EMAIL_USER}
${process.env.PORTFOLIO}
        `,
        attachments: [{
            filename: resumeFilename,
            path: resumePath,
            contentType: 'application/pdf'
        }],
        dsn: {
            id: messageId,
            return: 'headers',
            notify: ['failure', 'delay'],
            recipient: process.env.EMAIL_USER
        }
    };
};










const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const validateEmail = (email) => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};


module.exports.sendEmails = async (req, res) => {
    try {
        if (!transporter) {
            const initialized = await initializeEmail();
            if (!initialized) {
                throw new Error('Unable to initialize email transport');
            }
        }

        const { resume, csv } = req.files;
        const emails = await parseCsv(csv[0].path);

        if (!emails || emails.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid email addresses found in the file',
                totalEmails: 0
            });
        }

        // Validate and clean email list
        const validEmails = emails.filter(email => validateEmail(email));
        const results = [];
        let successCount = 0;

        // Implement exponential backoff for failed attempts
        const maxRetries = 3;
        const baseDelay = 2000; // 2 seconds

        for (const email of validEmails) {
            let retries = 0;
            let success = false;

            while (retries < maxRetries && !success) {
                try {
                    console.log(`Attempting to send email to: ${email} (Attempt ${retries + 1}/${maxRetries})`);

                    const mailOptions = createEmailContent(
                        email,
                        resume[0].path,
                        resume[0].originalname
                    );

                    await transporter.sendMail(mailOptions);
                    successCount++;
                    results.push({ email, status: 'success' });
                    success = true;

                    // Add longer delay between successful sends
                    await delay(30000); // 15 second delay between emails

                } catch (error) {
                    retries++;
                    console.error(`Failed to send email to ${email} (Attempt ${retries}/${maxRetries}):`, error);

                    if (retries === maxRetries) {
                        results.push({ email, status: 'failed', error: error.message });
                    } else {
                        // Exponential backoff
                        await delay(baseDelay * Math.pow(2, retries));
                    }
                }
            }
        }

        // Cleanup uploaded files
        try {
            fs.unlinkSync(resume[0].path);
            fs.unlinkSync(csv[0].path);
        } catch (cleanupError) {
            console.error('Error cleaning up files:', cleanupError);
        }

        return res.json({
            success: true,
            message: 'Emails processed',
            results,
            totalEmails: validEmails.length,
            successfulEmails: successCount
        });

    } catch (error) {
        console.error('Error in sendEmails controller:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to process emails',
            error: error.message
        });
    }
};