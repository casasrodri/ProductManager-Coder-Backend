import UserRepository from '../repositories/user.repository.js';
const userRepository = new UserRepository();

export default class UserController {
    async getByEmail(email) {
        return await userRepository.getByEmail(email);
    }

    async getById(id) {
        return await userRepository.getById(id);
    }

    async create(user) {
        return await userRepository.create(user);
    }
}
