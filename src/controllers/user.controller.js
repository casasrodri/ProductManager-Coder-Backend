import UserService from '../services/user.service.js';
const userService = new UserService();

export default class UserController {
    async getByEmail(email) {
        return await userService.getByEmail(email);
    }

    async getById(id) {
        return await userService.getById(id);
    }

    async create(user) {
        return await userService.create(user);
    }
}
