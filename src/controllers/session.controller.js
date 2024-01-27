import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { USER_ADMIN } from '../config/passport.js';
import config from '../config/config.js';

import sendEmail from '../services/emailing.js';
import { userRepository } from '../repositories/index.js';
import logger from '../utils/logger.js';

import UserDTO from '../dto/user.dto.js';

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
        logger.debug('The logout method has been called')
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
        const userId = req.user._id;
        const token = jwt.sign({ userId }, config.jwtSecret, {
            expiresIn: '24h',
        });
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

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
            logger.info('The admin is trying to log in')
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

        // Save datetime of last connection
        let user;
        if (userId !== USER_ADMIN._id) {
            user = await userRepository.updateLastConnection(userId);
        }

        const token = jwt.sign({ userId }, config.jwtSecret, {
            expiresIn: '24h',
        });
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

        // Redirect to home
        if (redirect && userId === USER_ADMIN._id) return res.redirect('/realTimeProducts');
        if (redirect) return res.redirect('/products');

        return res.json({
            status: 'success',
            message: 'Login successfull',
            data: { email },
        });
    }

    async current(req, res) {
        const userDTO = new UserDTO(req.user);
        res.json(userDTO);
    }

    async forgotPassword(req, res) {
        const { email } = req.body;

        console.log(email)

        const user = await userRepository.getByEmail(email);

        if (!user)
            return res.status(401).json({
                status: 'error',
                message: 'Email not registered.',
                data: { email },
            });

        // Generate token
        const token = jwt.sign({ user_reset: user._id }, config.jwtSecret, {
            expiresIn: '1h',
        });

        // Send email
        const emailBody = `
        <p>
            Hello ${user.first_name}!
        </p>

        <p>
            You have requested a link to reset your password.
        </p>

        <p>
            Please follow <a href="${config.host}/resetPassword/${token}">this link</a> to reset your password.
            Take into account it will expire in 1 hour.
        </p>

        <p>
            If you did not request this, please ignore this email.
        </p>

        <p>
            Kind regards,
            <br>
            <b>The team at E-Commerce</b>
        </p>
        `;

        sendEmail(user.email, `Reset your password`, emailBody);

        // Send response
        res.json({ status: 'ok', message: 'Email sent', data: { email } })
    }

    async resetPassword(req, res) {
        const { token, email, password } = req.body;
        let user;

        try {
            user = await userRepository.getByEmail(email);
        } catch (error) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email.',
                data: { email },
            });
        }

        // Check if the token is valid
        try {
            jwt.verify(token, config.jwtSecret);
        } catch (error) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid token.',
                data: { email },
            });
        }

        // Check if the password is the same
        const isMatch = bcrypt.compareSync(password, user.password);

        if (isMatch)
            return res.status(401).json({
                status: 'error',
                message: 'You cannot use the same password.',
                data: { email },
            });

        // Encrypt password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        // Update user
        user.password = hash;
        user.save()

        // Send response
        res.json({ status: 'ok', message: 'Password updated', data: { email } })
    }
}
