import nodemailer from 'nodemailer';
import config from '../config/config.js';
import logger from '../utils/logger.js';

// https://myaccount.google.com/apppasswords
// https://www.geeksforgeeks.org/how-to-send-email-with-nodemailer-using-gmail-account-in-node-js/
let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: config.gmailAuth,
});

export default (to, subject, html) => {
    const email = {
        from: {
            name: 'Ecommerce Team',
            address: config.gmailAuth.user
        },
        to,
        subject,
        html,
    };
    mailTransporter.sendMail(email, function (err, data) {
        if (err) {
            logger.error(`Error sending the email: "${email.subject}" to "${email.to}" `);
            logger.error('Detailed email service error:', err);
        } else {
            logger.info(`Email sent successfully to: "${email.to}" with subject: "${email.subject}"`);
        }
    });
};
