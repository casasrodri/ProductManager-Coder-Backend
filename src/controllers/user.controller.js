import { userRepository } from '../repositories/index.js';

export default class UserController {

    async premiumSwith(req, res) {
        const { uid } = req.params;

        const user = await userRepository.getById(uid);

        if (!user)
            return res.status(401).json({
                status: 'error',
                message: 'User not found.',
                data: { uid },
            });

        const oldRole = user.role || 'user';
        const newRole = oldRole === 'user' ? 'premium' : 'user';
        user.role = newRole
        user.save();

        res.json({ status: 'ok', message: 'User updated', data: { email: user.email, newRole } })
    }
}
