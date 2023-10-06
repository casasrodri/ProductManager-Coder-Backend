import MongoStore from 'connect-mongo';
import session from 'express-session';
import { MONGO_DB_URI } from '../dao/connector.js';

export default session({
    store: MongoStore.create({
        mongoUrl: MONGO_DB_URI,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 60 * 5, // 5 minutes
    }),
    secret: 'sasaCogirdoRnairdA',
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
