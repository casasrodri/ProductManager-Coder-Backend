import { Router } from 'express';
import { alreadyLogged, notLogged } from '../middlewares/session.js';
import { viewController } from '../controllers/index.js';

const router = Router();

router.get('/', viewController.logIn);

router.get('/viewproducts', viewController.viewProducts);

router.get('/products', viewController.products);

router.get('/realtimeproducts', viewController.realTimeProducts);

router.get('/carts/:cid', viewController.showCart);

router.get('/chat', viewController.chat);

router.get('/signup', alreadyLogged, viewController.signUp);

router.get('/login', alreadyLogged, viewController.logIn);

router.get('/logout', notLogged, viewController.logOut);

export default router;
