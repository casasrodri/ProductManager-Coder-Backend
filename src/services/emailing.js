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
        from: config.gmailAuth.user,
        to,
        subject,
        html,
    };
    mailTransporter.sendMail(email, function (err, data) {
        if (err) {
            logger.error('Error occurs:', err);
        } else {
            logger.http('Email sent successfully to:', email.to, email.subject);
        }
    });
};
