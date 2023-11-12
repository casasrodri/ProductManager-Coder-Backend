import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import USER_ADMIN from '../config/passport.js';
import config from '../config/config.js';

import { userRepository } from '../repositories/index.js';

export default class SessionController {
    async localSignUp(req, res) {
        const { redirect } = req.query;

        // Redirect to home
        if (redirect) return res.status(201).redirect('/login');

        res.status(201).json({
            status: 'ok',
            message: 'User registred',
            data: { email: req.user.email },
        });
    }

    async localFailRegister(req, res) {
        const mensajes = req.session.messages;

        res.status(401).json({
            error:
                'An error has occurred during the registration process: ' +
                mensajes[mensajes.length - 1],
        });
    }

    async localLogIn(req, res) {
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

    async localFailLogin(req, res) {
        const mensajes = req.session.messages;

        res.status(403).json({
            error:
                'An error has occurred during the login process: ' +
                mensajes[mensajes.length - 1],
        });
    }

    async logout(req, res) {
        const { redirect } = req.query;

        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Logout error',
                    data: { err },
                });
            }
        });

        res.cookie('jwt', '', { maxAge: 1 });

        // Redirect to home
        if (redirect) return res.status(200).redirect('/products');

        res.status(200).send({
            status: 'ok',
            message: 'Logout successfull',
            data: {},
        });
    }

    githubCallback(req, res) {
        // Save sessions
        req.session.name = req.user.first_name;
        req.session.email = req.user.email;
        req.session.role = req.user.role;
        req.session.isLogged = true;

        res.redirect('/products');
    }

    async login(req, res) {
        const { redirect } = req.query;
        const { email, password } = req.body;

        res.cookie('jwt', '', { maxAge: 1 });

        let userId;
        if (email === USER_ADMIN.email && password === USER_ADMIN.password) {
            userId = USER_ADMIN._id;
        } else {
            const user = await userRepository.getByEmail(email);

            if (!user)
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid credentials',
                    data: { email },
                });

            const isMatch = bcrypt.compareSync(password, user.password);

            if (!isMatch)
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid credentials',
                    data: { email },
                });

            userId = user._id;
        }

        const token = jwt.sign({ userId }, config.jwtSecret, {
            expiresIn: '24h',
        });
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

        // Redirect to home
        if (redirect) return res.redirect('/products');

        return res.json({
            status: 'success',
            message: 'Login successfull',
            data: { email },
        });
    }

    async current(req, res) {
        res.json(req.user);
    }
}
