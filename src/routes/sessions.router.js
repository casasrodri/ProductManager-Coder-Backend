import { Router } from 'express';
import User from '../dao/mongo/models/user.js';
import bcrypt from 'bcrypt';

const router = Router();

router.post('/signup', async (req, res) => {
    let { first_name, last_name, email, password } = req.body;
    const { redirect } = req.query;

    // Check if exists
    const user = await User.findOne({ email });

    // Redirect to home if exists
    if (user)
        return res.status(409).send({
            status: 'error',
            message: 'User already exists',
            data: { email },
        });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
        first_name,
        last_name,
        email,
        password,
    });

    // Save session
    req.session.name = newUser.first_name;
    req.session.role = newUser.role;
    req.session.email = newUser.email;
    req.session.isLogged = true;

    // Redirect to home
    if (redirect) return res.status(201).redirect('/products');

    res.status(201).send({
        status: 'ok',
        message: 'User created',
        data: { email: newUser.email },
    });
});

// FIXME Dejar el verdadero valor
const USER_ADMIN = {
    first_name: 'ADMINISTRATOR',
    email: 'admin', //'adminCoder@coder.com',
    password: 'admin', //'adminCod3r123',
    role: 'admin',
};

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const { redirect } = req.query;
    let user;

    if (email === USER_ADMIN.email && password === USER_ADMIN.password) {
        user = USER_ADMIN;
    } else {
        try {
            user = await User.findOne({ email });
            const isMatch = await bcrypt.compare(password, user.password);
            if (!user || !isMatch) throw new Error('Invalid credentials');
        } catch (error) {
            return res.status(403).send({
                status: 'error',
                message: 'Invalid credentials',
                data: { email },
            });
        }
    }

    // Save session
    req.session.name = user.first_name;
    req.session.email = user.email;
    req.session.role = user.role;
    req.session.isLogged = true;

    // Redirect to home
    if (redirect) return res.status(200).redirect('/products');

    res.status(200).send({
        status: 'ok',
        message: 'Login successfull',
        data: { email: newUser.email },
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

export default router;
