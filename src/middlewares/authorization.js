const ROLES = ['user', 'admin'];
import { userRepository } from '../repositories/index.js';

export default (permittedRoles) => {
    return async (req, res, next) => {
        permittedRoles.forEach((element) => {
            if (!ROLES.includes(element)) {
                return res
                    .status(500)
                    .json({ message: `Invalid role: ${element}` });
            }
        });

        console.log(req.user);

        if (permittedRoles.includes(req.user.role)) {
            next();
        } else {
            return res.status(403).json({ message: 'Forbidden' });
        }
    };
};
