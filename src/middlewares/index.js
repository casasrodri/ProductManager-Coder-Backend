import express from 'express';
import sessionMiddleware from './session.js';
import logRequests from './console.js';

import passport from 'passport';
import initializePassport from '../config/passport.js';

export default (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/static', express.static(process.cwd() + '/public'));
    app.use(sessionMiddleware);
    app.use(logRequests({ ip: false, color: true, body: true }));

    // Passport
    initializePassport();
    app.use(passport.initialize());
    app.use(passport.session());
};
