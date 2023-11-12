import { userRepository } from '../repositories/index.js';

export const loadUser = async (req, res, next) => {
    const { userId } = req.user;
    req.user = await userRepository.getById(userId).populate('cart').lean();
    next();
};
