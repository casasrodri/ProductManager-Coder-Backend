import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
import User from '../dao/mongo/models/user.js';
import bcrypt, { hash } from 'bcrypt';

const LocalStrategy = local.Strategy;

const USER_ADMIN = {
    _id: 'admin_id',
    first_name: 'ADMINISTRATOR',
    email: 'adminCoder@coder.com',
    password: 'adminCod3r123',
    role: 'admin',
};

export default () => {
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (_id, done) => {
        if (_id === USER_ADMIN._id) return done(null, USER_ADMIN);

        const user = await User.findById(_id);
        done(null, user);
    });

    passport.use(
        'localSignup',
        new LocalStrategy(
            { passReqToCallback: true, usernameField: 'email' },
            async (req, email, password, done) => {
                const { first_name, last_name } = req.body;

                if (!first_name || !last_name || !email || !password) {
                    console.log(req.body, first_name, last_name);
                    return done(null, false, {
                        message:
                            'You must send the following information: first_name, last_name, email and password.',
                    });
                }

                try {
                    let user = await User.findOne({ email });
                    if (user) {
                        return done(null, false, {
                            message:
                                'User already exists, cannot register again.',
                        });
                    }

                    const hashedPassword = await bcrypt.hash(password, 10);

                    user = await User.create({
                        first_name,
                        last_name,
                        email,
                        password: hashedPassword,
                    });

                    return done(null, user);
                } catch (error) {
                    req.errorRegister =
                        'An error has occurred: ' + error.message;
                    return done(error);
                }
            }
        )
    );

    passport.use(
        'localLogin',
        new LocalStrategy(
            { usernameField: 'email' },
            async (email, password, done) => {
                let user;

                if (
                    email === USER_ADMIN.email &&
                    password === USER_ADMIN.password
                ) {
                    return done(null, USER_ADMIN);
                } else {
                    try {
                        user = await User.findOne({ email });

                        if (!user)
                            return done(null, false, {
                                message: 'Invalid credentials',
                            });

                        const isMatch = await bcrypt.compare(
                            password,
                            user.password
                        );

                        if (!isMatch)
                            return done(null, false, {
                                message: 'Invalid credentials',
                            });

                        return done(null, user);
                    } catch (error) {
                        return done(error);
                    }
                }
            }
        )
    );

    passport.use(
        'github',
        new GitHubStrategy(
            {
                clientID: 'Iv1.7229790bba006a45',
                clientSecret: '522aee1df6c90fc8ad621ad98f51ddc18c26dad1',
                scope: ['user:email'],
                callbackURL:
                    'http://localhost:8080/api/sessions/githubcallback',
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const email = profile.emails[0].value;

                    const user = await User.findOne({ email });

                    if (!user) {
                        const newUser = await User.create({
                            first_name: profile.displayName,
                            email,
                            password: '',
                        });

                        return done(null, newUser);
                    }

                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );
};
