import User from '../dao/mongo/models/user.js';
import { USER_ADMIN } from '../config/passport.js';

export default class UserRepository {
    async getByEmail(email) {
        return await User.findOne({ email });
    }

    async getById(id) {
        if (id === USER_ADMIN._id) return USER_ADMIN;

        return await User.findById(id);
    }

    async create(user) {
        return await User.create(user);
    }
}
