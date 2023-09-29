import MongoStore from 'connect-mongo';
import session from 'express-session';
import { MONGO_DB_URI } from '../dao/connector.js';

export default session({
    store: MongoStore.create({
        mongoUrl: MONGO_DB_URI,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 60 * 5,
    }),
    secret: 'sasaCogirdoRnairdA',
    resave: false,
    saveUninitialized: false,
});
