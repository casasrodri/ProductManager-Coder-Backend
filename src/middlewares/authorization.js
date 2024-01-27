const ROLES = ['user', 'admin', 'premium'];
import passport from 'passport';

export default (permittedRoles) => {
    return [
        // Necesary for deserialize the JWT token and get req.user
        passport.authenticate('jwt', { session: false }),

        // Middleware for limit access
        async (req, res, next) => {
            permittedRoles.forEach((element) => {
                if (!ROLES.includes(element)) {
                    return res
                        .status(500)
                        .json({ message: `Invalid role: ${element}` });
                }
            });

            if (permittedRoles.includes(req.user.role)) {
                next();
            } else {
                return res.status(403).json({ message: 'Forbidden' });
            }
        },
    ];
};
