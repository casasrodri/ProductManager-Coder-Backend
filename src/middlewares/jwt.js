import UserController from '../controllers/user.controller.js';
const userController = new UserController();

export const loadUser = async (req, res, next) => {
    const { userId } = req.user;
    req.user = await userController.getById(userId).populate('cart').lean();
    next();
};
