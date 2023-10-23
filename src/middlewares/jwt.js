import User from '../dao/mongo/models/user.js';

export const loadUser = async (req, res, next) => {
    const { userId } = req.user;
    req.user = await User.findById(userId).populate('cart').lean();
    next();
};
