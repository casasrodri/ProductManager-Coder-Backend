import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
import bcrypt, { hash } from 'bcrypt';
import jwt from 'passport-jwt';
import config from '../config/config.js';

import { userRepository } from '../repositories/index.js';

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

export const USER_ADMIN = config.userAdmin;

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    return token;
};

export default () => {
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (_id, done) => {
        if (_id === USER_ADMIN._id) return done(null, USER_ADMIN);

        const user = await userRepository.getById(_id);
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
                    let user = await userRepository.getByEmail(email);
                    if (user) {
                        return done(null, false, {
                            message:
                                'User already exists, cannot register again.',
                        });
                    }

                    const hashedPassword = await bcrypt.hash(password, 10);

                    user = await userRepository.create({
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
                        user = await userRepository.getByEmail(email);

                        if (!user)
                            return done(null, false, {
                                message: 'Invalid credentials',
                            });

                        const isMatch = bcrypt.compareSync(
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
                clientID: config.githubLogin.clientID,
                clientSecret: config.githubLogin.clientSecret,
                scope: ['user:email'],
                callbackURL: config.githubLogin.callbackURL,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const email = profile.emails[0].value;

                    const user = await userRepository.getByEmail(email);

                    if (!user) {
                        const newUser = await userRepository.create({
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

    passport.use(
        'jwt',
        new JWTStrategy(
            {
                jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
                secretOrKey: config.jwtSecret,
            },
            async (jwtPayload, done) => {
                try {
                    return done(null, jwtPayload);
                } catch (err) {
                    return done(err);
                }
            }
        )
    );
};
