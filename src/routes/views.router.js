import { Router } from '../services/errors/customRouter.js';
import { alreadyLogged, notLogged } from '../middlewares/session.js';
import { viewController } from '../controllers/index.js';
import authRole from '../middlewares/authorization.js';
import config from '../config/config.js';

const router = Router();

router.get('/', viewController.redirectLogIn);

import { CustomError, errorTypes } from '../services/errors/customError.js';

router.get('/error', async (req, res) => {
    throw new CustomError({
        name: 'HomeErrorCus',
        message: 'Error al ingresar a la home desde la clase Cus',
        cause: 'El server no tiene ganas de responder a esta solicitud desde la clase Cus.',
        type: errorTypes.DATABASE,
        statusCode: 418,
    });
});

router.get('/viewproducts', viewController.viewProducts);

router.get('/products', authRole(['user', 'premium']), viewController.products);

router.get(
    '/realtimeproducts',
    authRole(['admin', 'premium']),
    viewController.realTimeProducts
);

router.get('/carts/:cid', viewController.showCart);

router.get('/chat', authRole(['user', 'premium']), viewController.chat);

// alreadyLogged
router.get('/signup', viewController.signUp);

// alreadyLogged
router.get('/login', viewController.logIn);

// notLogged
router.get('/logout', viewController.logOut);

router.get('/mockingproducts', viewController.mockingProducts);

router.get('/forgotPassword', viewController.forgotPassword);
router.get('/resetPassword/:token', viewController.resetPassword);

router.get('/loggerTest', viewController.loggerTest);

router.get('/env', (req, res) => {
    res.json({ env: config.environment });
});

router.get('/admin/users', viewController.adminUsers); // TODO authRole(['admin']),

export default router;
