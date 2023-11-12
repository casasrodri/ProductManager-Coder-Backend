import User from '../dao/mongo/models/user.js';

export default class UserRepository {
    async getByEmail(email) {
        return await User.findOne({ email });
    }

    async getById(id) {
        return await User.findById(id);
    }

    async create(user) {
        return await User.create(user);
    }
}
