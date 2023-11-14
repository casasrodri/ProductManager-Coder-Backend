import nodemailer from 'nodemailer';
import config from '../config/config.js';

// https://myaccount.google.com/apppasswords
// https://www.geeksforgeeks.org/how-to-send-email-with-nodemailer-using-gmail-account-in-node-js/
let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: config.gmailAuth,
});

export default (to, subject, text) => {
    const email = {
        from: config.gmailAuth.user,
        to,
        subject,
        text,
    };
    mailTransporter.sendMail(email, function (err, data) {
        if (err) {
            console.log('Error occurs:', err);
        } else {
            console.log('Email sent successfully to:', email.to, email.subject);
        }
    });
};
