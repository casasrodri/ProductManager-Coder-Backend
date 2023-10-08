import { Router } from 'express';
import User from '../dao/mongo/models/user.js';
import bcrypt from 'bcrypt';
import passport from 'passport';

const router = Router();

router.post(
    '/signup',
    passport.authenticate('localSignup', {
        failureRedirect: '/api/sessions/failRegister',
        failureMessage: true,
    }),

    async (req, res) => {
        const { redirect } = req.query;

        // Redirect to home
        if (redirect) return res.status(201).redirect('/login');

        res.status(201).json({
            status: 'ok',
            message: 'User registred',
            data: { email: req.user.email },
        });
    }
);

router.get('/failRegister', (req, res) => {
    const mensajes = req.session.messages;

    res.status(401).json({
        error:
            'An error has occurred during the registration process: ' +
            mensajes[mensajes.length - 1],
    });
});

router.post(
    '/login',
    passport.authenticate('localLogin', {
        failureRedirect: '/api/sessions/failLogin',
        failureMessage: true,
    }),
    async (req, res) => {
        const { redirect } = req.query;

        if (!req.user)
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials',
                data: { email },
            });

        // Save sessions
        req.session.name = req.user.first_name;
        req.session.email = req.user.email;
        req.session.role = req.user.role;
        req.session.isLogged = true;

        if (redirect) return res.status(200).redirect('/products');

        res.status(200).json({
            status: 'ok',
            message: 'Login successfull',
            data: { email: newUser.email },
        });
    }
);

router.get('/failLogin', (req, res) => {
    const mensajes = req.session.messages;

    res.status(403).json({
        error:
            'An error has occurred during the login process: ' +
            mensajes[mensajes.length - 1],
    });
});

router.post('/logout', async (req, res) => {
    const { redirect } = req.query;

    await req.session.destroy((err) => {
        if (err) {
            return res.status(500).send({
                status: 'error',
                message: 'Logout error',
                data: { err },
            });
        }
    });

    // Redirect to home
    if (redirect) return res.status(200).redirect('/products');

    res.status(200).send({
        status: 'ok',
        message: 'Logout successfull',
        data: {},
    });
});

router.get(
    '/githubLogin',
    passport.authenticate('github', { scope: ['user:email'] })
);

router.get(
    '/githubcallback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        // Save sessions
        req.session.name = req.user.first_name;
        req.session.email = req.user.email;
        req.session.role = req.user.role;
        req.session.isLogged = true;

        res.redirect('/products');
    }
);

export default router;
