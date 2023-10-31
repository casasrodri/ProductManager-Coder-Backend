import MongoStore from 'connect-mongo';
import session from 'express-session';
import config from '../config/config.js';

export default session({
    store: MongoStore.create({
        mongoUrl: config.mongoUri,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 60 * 5, // 5 minutes
    }),
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
});

export const alreadyLogged = (req, res, next) => {
    if (req.session.isLogged) {
        return res.redirect('/');
    }
    next();
};

export const notLogged = (req, res, next) => {
    if (!req.session.isLogged) {
        return res.redirect('/login');
    }
    next();
};
