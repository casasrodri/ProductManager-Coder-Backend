import CartController from './cart.controller.js';
import ProductController from './product.controller.js';
import SessionController from './session.controller.js';
import ViewController from './view.controller.js';
import UserController from './user.controller.js';

export const cartController = new CartController();
export const productController = new ProductController();
export const sessionController = new SessionController();
export const viewController = new ViewController();
export const userController = new UserController();
