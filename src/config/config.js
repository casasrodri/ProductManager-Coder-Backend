import dotenv from 'dotenv';
dotenv.config();

export default {
    environment: process.env.ENVIRONMENT,
    port: process.env.PORT || 8080,
    mongoUri: process.env.MONGO_DB_URI,
    mongoUriTest: process.env.MONGO_DB_URI_TEST,

    userAdmin: {
        _id: 'admin_id',
        first_name: process.env.ADMIN_NAME,
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin',
    },

    githubLogin: {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
    },

    jwtSecret: process.env.JWT_SECRET,
    sessionSecret: process.env.SESSION_SECRET,

    gmailAuth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
    },
};
