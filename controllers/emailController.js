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

    // return {
    //     from: {
    //         name: senderName,
    //         address: process.env.EMAIL_USER
    //     },
    //     to: recipientEmail,
    //     subject: `Frontend Developer Position - ${job}`,
    //     messageId: `<${messageId}>`,
    //     headers: {
    //         'List-Unsubscribe': `<mailto:${process.env.EMAIL_USER}?subject=unsubscribe>`,
    //         'Precedence': 'Bulk',
    //         'X-Auto-Response-Suppress': 'OOF, AutoReply',
    //         'X-Report-Abuse': `Please report abuse to: ${process.env.EMAIL_USER}`,
    //         'Feedback-ID': messageId
    //     },
    //     html: `
    // <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 680px; margin: 20px auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e8e8e8;">
    //     <div style="background: #2b3d4f; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
    //         <h1 style="color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 0.5px;">NAVEEN K</h1>
    //         <p style="color: #a0b3c6; margin: 8px 0 0; font-size: 14px;">Frontend Developer Application</p>
    //     </div>
    
    //     <div style="padding: 32px 40px;">
    //         <p style="color: #4a5568; margin: 0 0 20px; line-height: 1.6;">Dear Hiring Manager,</p>
            
    //         <p style="color: #4a5568; margin: 0 0 20px; line-height: 1.6;">
    //             I trust this message finds you well. I am Naveen, a Frontend Developer with over a year of experience crafting responsive web applications. I am writing to express my interest in contributing to your development team.
    //         </p>
    
    //         <div style="border-left: 3px solid #2b3d4f; padding-left: 20px; margin: 20px 0;">
    //             <p style="color: #4a5568; margin: 0 0 16px; line-height: 1.6;">
    //                 Key Technical Proficiencies:
    //             </p>
    //             <ul style="margin: 0; padding: 0; list-style: none;">
    //                 <li style="margin: 8px 0; padding-left: 24px; position: relative; color: #4a5568;">
    //                     <span style="position: absolute; left: 0; color: #2b3d4f;">▹</span>
    //                     Frontend Development: HTML5, CSS3, JavaScript (ES6+)
    //                 </li>
    //                 <li style="margin: 8px 0; padding-left: 24px; position: relative; color: #4a5568;">
    //                     <span style="position: absolute; left: 0; color: #2b3d4f;">▹</span>
    //                     React.js Development: Components, Hooks, Context API
    //                 </li>
    //                 <li style="margin: 8px 0; padding-left: 24px; position: relative; color: #4a5568;">
    //                     <span style="position: absolute; left: 0; color: #2b3d4f;">▹</span>
    //                     State Management: Redux Toolkit, React Query
    //                 </li>
    //                 <li style="margin: 8px 0; padding-left: 24px; position: relative; color: #4a5568;">
    //                     <span style="position: absolute; left: 0; color: #2b3d4f;">▹</span>
    //                     Backend Familiarity: Node.js, Express.js, MySQL
    //                 </li>
    //             </ul>
    //         </div>
    
    //         <div style="margin: 24px 0;">
    //             <p style="color: #4a5568; margin: 0 0 16px; line-height: 1.6;">
    //                 Project Portfolio:
    //             </p>
                
    //             <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 16px;">
    //                 <h3 style="color: #2b3d4f; margin: 0 0 12px;">Cleaning Service Web Application</h3>
    //                 <p style="color: #4a5568; margin: 0; line-height: 1.6;">
    //                     Created a responsive interface using React.js and Redux Toolkit, featuring reusable components and seamless API integration for real-time data management.
    //                 </p>
    //             </div>
    
    //             <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 16px;">
    //                 <h3 style="color: #2b3d4f; margin: 0 0 12px;">Portfolio Website</h3>
    //                 <p style="color: #4a5568; margin: 0; line-height: 1.6;">
    //                     Developed a personal portfolio using HTML, CSS, and JavaScript, integrating Firebase for secure form submissions and enhanced user interaction.
    //                 </p>
    //             </div>
    
    //             <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 16px;">
    //                 <h3 style="color: #2b3d4f; margin: 0 0 12px;">Khannan Finance Website</h3>
    //                 <p style="color: #4a5568; margin: 0; line-height: 1.6;">
    //                     Built a professional finance company website with responsive design, implementing Formspree for reliable contact form functionality and user engagement.
    //                 </p>
    //             </div>
    
    //             <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 16px;">
    //                 <h3 style="color: #2b3d4f; margin: 0 0 12px;">Automatic Resume Sender</h3>
    //                 <p style="color: #4a5568; margin: 0; line-height: 1.6;">
    //                     Engineered an automated email solution using React.js frontend and Node.js/Express.js backend with Nodemailer, enabling efficient bulk resume distribution through CSV file processing.
    //                 </p>
    //             </div>
    
    //             <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 16px;">
    //                 <h3 style="color: #2b3d4f; margin: 0 0 12px;">Vote Tracker</h3>
    //                 <p style="color: #4a5568; margin: 0; line-height: 1.6;">
    //                     Developed a React.js voting application with Firebase integration, featuring dynamic candidate selection by state and district, single-vote verification, and real-time top candidate tracking.
    //                 </p>
    //             </div>
    
    //             <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
    //                 <h3 style="color: #2b3d4f; margin: 0 0 12px;">Chennai Gated Website</h3>
    //                 <p style="color: #4a5568; margin: 0; line-height: 1.6;">
    //                     Designed and implemented a modern real estate platform using React.js, featuring an intuitive interface for property listings and comprehensive amenity showcases.
    //                 </p>
    //             </div>
    //         </div>
    
    //         <p style="color: #4a5568; margin: 20px 0; line-height: 1.6;">
    //             I welcome the opportunity to discuss how my experience aligns with your team's needs. Please visit my portfolio at naveenak.netlify.app to explore these projects in detail.
    //         </p>
    
    //         <div style="margin-top: 32px; border-top: 1px solid #e8e8e8; padding-top: 24px;">
    //             <p style="margin: 0 0 8px; color: #4a5568;">
    //                 Best regards,<br>
    //                 <strong style="color: #2b3d4f;">Naveen K</strong>
    //             </p>
    //             <div style="margin-top: 12px;">
    //                 <p style="color: #4a5568; margin: 4px 0; font-size: 14px;">📞 7548865624</p>
    //                 <a href="mailto:${process.env.EMAIL_USER}" style="color: #3182ce; text-decoration: none; font-size: 14px; display: block; margin: 4px 0;">📧 Email</a>
    //                 <a href="${process.env.PORTFOLIO}" style="color: #3182ce; text-decoration: none; font-size: 14px; display: block; margin: 4px 0;">🌐 Portfolio</a>
    //             </div>
    //         </div>
    //     </div>
    
    //     <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
    //         <p style="color: #718096; font-size: 12px; margin: 8px 0;">
    //             To opt out of future communications, please reply with "unsubscribe"
    //         </p>
    //     </div>
    // </div>
    // `,
    //     text: `
    // Frontend Developer Application
    
    // Dear Hiring Manager,
    
    // I trust this message finds you well. I am Naveen, a Frontend Developer with over a year of experience crafting responsive web applications. I am writing to express my interest in contributing to your development team.
    
    // Key Technical Proficiencies:
    // - Frontend Development: HTML5, CSS3, JavaScript (ES6+)
    // - React.js Development: Components, Hooks, Context API
    // - State Management: Redux Toolkit, React Query
    // - Backend Familiarity: Node.js, Express.js, MySQL
    
    // Project Portfolio:
    
    // Cleaning Service Web Application
    // - Created a responsive interface using React.js and Redux Toolkit
    // - Implemented reusable components and real-time data integration
    
    // Portfolio Website
    // - Developed a personal portfolio using HTML, CSS, and JavaScript
    // - Integrated Firebase for secure form submissions
    
    // Khannan Finance Website
    // - Built a professional finance company website with responsive design
    // - Implemented Formspree for reliable contact form functionality
    
    // Automatic Resume Sender
    // - Engineered an automated email solution using React.js and Node.js/Express.js
    // - Enabled efficient bulk resume distribution through CSV file processing
    
    // Vote Tracker
    // - Developed a React.js voting application with Firebase integration
    // - Implemented dynamic candidate selection and real-time tracking
    
    // Chennai Gated Website
    // - Designed a modern real estate platform using React.js
    // - Created intuitive interface for property listings and amenities
    
    // I welcome the opportunity to discuss how my experience aligns with your team's needs. Please visit my portfolio at naveenak.netlify.app to explore these projects in detail.
    
    // Best regards,
    // Naveen K
    // Phone: 7548865624
    // Email: ${process.env.EMAIL_USER}
    // Portfolio: ${process.env.PORTFOLIO}
    // `,
    //     attachments: [{
    //         filename: resumeFilename,
    //         path: resumePath,
    //         contentType: 'application/pdf'
    //     }],
    //     dsn: {
    //         id: messageId,
    //         return: 'headers',
    //         notify: ['failure', 'delay'],
    //         recipient: process.env.EMAIL_USER
    //     }
    // };

    return {
        from: {
            name: senderName,
            address: process.env.EMAIL_USER
        },
        to: recipientEmail,
        subject: `Frontend Developer Position - ${job}`,
        messageId: `${messageId}@${process.env.EMAIL_USER.split('@')[1]}`,
        headers: {
            'List-Unsubscribe': `<mailto:${process.env.EMAIL_USER}?subject=unsubscribe>`,
            'X-Mailer': 'NodeMailer'
        },
        html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Frontend Developer Application</title>
        <style>
            @media screen and (max-width: 600px) {
                #desktop-view { display: none !important; }
                #mobile-view { display: block !important; }
            }
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;">
        <!-- Mobile View -->
        <div id="mobile-view" style="display: none; padding: 20px; background-color: white; white-space: pre-line;">
    Frontend Developer Application - Naveen K
    
    Dear Hiring Manager,
    
    I trust this message finds you well. I am Naveen, a Frontend Developer with over a year of experience crafting responsive web applications. I am writing to express my interest in contributing to your development team.
    
    Technical Skills:
    ▹ Frontend Development: HTML5, CSS3, JavaScript (ES6+)
    ▹ React.js Development: Components, Hooks, Context API
    ▹ State Management: Redux Toolkit, React Query
    ▹ Backend Familiarity: Node.js, Express.js, MySQL
    
    Project Portfolio:
    
    Cleaning Service Web Application
    - Created a responsive interface using React.js and Redux Toolkit
    - Implemented reusable components and API integration
    
    Portfolio Website
    - Developed a personal portfolio using HTML, CSS, and JavaScript
    - Integrated Firebase for secure form submissions
    
    Khannan Finance Website
    - Built a professional finance company website with responsive design
    - Implemented Formspree for reliable contact form functionality
    
    Vote Tracker
    - Developed a React.js voting application with Firebase integration
    - Implemented dynamic candidate selection and real-time tracking
    
    Chennai Gated Website
    - Designed a modern real estate platform using React.js
    - Created intuitive interface for property listings
    
    I welcome the opportunity to discuss how my experience aligns with your team's needs. Please visit my portfolio at naveenak.netlify.app to explore these projects in detail.
    
    Best regards,
    Naveen K
    
    Contact Information:
    Phone: 7548865624
    Email: ${process.env.EMAIL_USER}
    Portfolio: ${process.env.PORTFOLIO}
    
    To unsubscribe from future communications, please reply with "unsubscribe"
        </div>
    
        <!-- Desktop View -->
        <div id="desktop-view" style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
                <tr>
                    <td>
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #1a1a1a; border-radius: 8px; overflow: hidden;">
                            <tr>
                                <!-- Left Column -->
                                <td style="width: 35%; padding: 20px; vertical-align: top; background-color: #1a1a1a;">
                                    <h1 style="margin: 0 0 10px 0; color: #98ff00; font-weight: bold;">Naveen K</h1>
                                    <p style="margin: 0 0 20px 0; color: #ffffff;">Frontend Developer</p>
                                    
                                    <div style="margin: 20px 0;">
                                        <p style="margin: 0 0 8px 0; color: #98ff00; font-weight: bold;">Contact</p>
                                        <p style="margin: 4px 0; color: #ffffff;">📞 7548865624</p>
                                        <p style="margin: 4px 0;">
                                            <a href="mailto:${process.env.EMAIL_USER}" style="color: #98ff00; text-decoration: none;">📧 Email</a>
                                        </p>
                                        <p style="margin: 4px 0;">
                                            <a href="${process.env.PORTFOLIO}" style="color: #98ff00; text-decoration: none;">🌐 Portfolio</a>
                                        </p>
                                    </div>
                                </td>
    
                                <!-- Right Column -->
                                <td style="width: 65%; padding: 20px; vertical-align: top; background-color: #222222;">
                                    <div style="margin-bottom: 25px;">
                                        <p style="margin: 0 0 15px 0; color: #ffffff;">
                                            Dear Hiring Manager,
                                        </p>
                                        <p style="margin: 0 0 15px 0; color: #ffffff;">
                                            I trust this message finds you well. I am Naveen, a Frontend Developer with over a year of experience crafting responsive web applications. I am writing to express my interest in contributing to your development team.
                                        </p>
                                    </div>
    
                                    <div style="margin-bottom: 25px;">
                                        <h2 style="margin: 0 0 15px 0; color: #98ff00; font-weight: bold;">Technical Skills</h2>
                                        <div style="color: #ffffff;">
                                            <p style="margin: 8px 0; padding-left: 15px;">▹ Frontend Development: HTML5, CSS3, JavaScript (ES6+)</p>
                                            <p style="margin: 8px 0; padding-left: 15px;">▹ React.js Development: Components, Hooks, Context API</p>
                                            <p style="margin: 8px 0; padding-left: 15px;">▹ State Management: Redux Toolkit, React Query</p>
                                            <p style="margin: 8px 0; padding-left: 15px;">▹ Backend Familiarity: Node.js, Express.js, MySQL</p>
                                        </div>
                                    </div>
    
                                    <div style="margin-bottom: 25px;">
                                        <h2 style="margin: 0 0 15px 0; color: #98ff00; font-weight: bold;">Project Portfolio</h2>
                                        
                                        <div style="background-color: #1a1a1a; padding: 15px; margin: 0 0 15px 0; border: 1px solid #333333;">
                                            <h3 style="margin: 0 0 8px 0; color: #98ff00;">Cleaning Service Web Application</h3>
                                            <p style="margin: 0; color: #ffffff;">
                                                Created a responsive interface using React.js and Redux Toolkit, featuring reusable components and seamless API integration for real-time data management.
                                            </p>
                                        </div>
    
                                        <div style="background-color: #1a1a1a; padding: 15px; margin: 0 0 15px 0; border: 1px solid #333333;">
                                            <h3 style="margin: 0 0 8px 0; color: #98ff00;">Portfolio Website</h3>
                                            <p style="margin: 0; color: #ffffff;">
                                                Developed a personal portfolio using HTML, CSS, and JavaScript, integrating Firebase for secure form submissions and enhanced user interaction.
                                            </p>
                                        </div>
    
                                        <div style="background-color: #1a1a1a; padding: 15px; margin: 0 0 15px 0; border: 1px solid #333333;">
                                            <h3 style="margin: 0 0 8px 0; color: #98ff00;">Khannan Finance Website</h3>
                                            <p style="margin: 0; color: #ffffff;">
                                                Built a professional finance company website with responsive design, implementing Formspree for reliable contact form functionality and user engagement.
                                            </p>
                                        </div>
    
                                        <div style="background-color: #1a1a1a; padding: 15px; margin: 0 0 15px 0; border: 1px solid #333333;">
                                            <h3 style="margin: 0 0 8px 0; color: #98ff00;">Vote Tracker</h3>
                                            <p style="margin: 0; color: #ffffff;">
                                                Developed a React.js voting application with Firebase integration, featuring dynamic candidate selection by state and district, single-vote verification, and real-time top candidate tracking.
                                            </p>
                                        </div>
    
                                        <div style="background-color: #1a1a1a; padding: 15px; margin: 0 0 15px 0; border: 1px solid #333333;">
                                            <h3 style="margin: 0 0 8px 0; color: #98ff00;">Chennai Gated Website</h3>
                                            <p style="margin: 0; color: #ffffff;">
                                                Designed and implemented a modern real estate platform using React.js, featuring an intuitive interface for property listings and comprehensive amenity showcases.
                                            </p>
                                        </div>
                                    </div>
    
                                    <div style="margin-bottom: 20px;">
                                        <p style="margin: 0 0 15px 0; color: #ffffff;">
                                            I welcome the opportunity to discuss how my experience aligns with your team's needs. Please visit my portfolio at naveenak.netlify.app to explore these projects in detail.
                                        </p>
                                        <p style="margin: 0; color: #ffffff;">
                                            Best regards,<br>
                                            Naveen K
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        </table>
    
                        <div style="background-color: #1a1a1a; padding: 15px; text-align: center; margin-top: 20px;">
                            <p style="color: #666666; font-size: 12px; margin: 0;">
                                A professional introduction powered by technology! My profile has been auto-submitted for your review. Looking forward to connecting!
                            </p>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </body>
    </html>`,
        text: `Frontend Developer Application - Naveen K
    
    Dear Hiring Manager,
    
    I trust this message finds you well. I am Naveen, a Frontend Developer with over a year of experience crafting responsive web applications. I am writing to express my interest in contributing to your development team.
    
    Technical Skills:
    ▹ Frontend Development: HTML5, CSS3, JavaScript (ES6+)
    ▹ React.js Development: Components, Hooks, Context API
    ▹ State Management: Redux Toolkit, React Query
    ▹ Backend Familiarity: Node.js, Express.js, MySQL
    
    Project Portfolio:
    
    Cleaning Service Web Application
    - Created a responsive interface using React.js and Redux Toolkit
    - Implemented reusable components and API integration
    
    Portfolio Website
    - Developed a personal portfolio using HTML, CSS, and JavaScript
    - Integrated Firebase for secure form submissions
    
    Khannan Finance Website
    - Built a professional finance company website with responsive design
    - Implemented Formspree for reliable contact form functionality
    
    Vote Tracker
    - Developed a React.js voting application with Firebase integration
    - Implemented dynamic candidate selection and real-time tracking
    
    Chennai Gated Website
    - Designed a modern real estate platform using React.js
    - Created intuitive interface for property listings
    
    I welcome the opportunity to discuss how my experience aligns with your team's needs. Please visit my portfolio at naveenak.netlify.app to explore these projects in detail.
    
    Best regards,
    Naveen K
    
    Contact Information:
    Phone: 7548865624
    Email: ${process.env.EMAIL_USER}
    Portfolio: ${process.env.PORTFOLIO}
    
    To unsubscribe from future communications, please reply with "unsubscribe"`,
        attachments: [{
            filename: resumeFilename,
            path: resumePath,
            contentType: 'application/pdf'
        }]
    }};









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