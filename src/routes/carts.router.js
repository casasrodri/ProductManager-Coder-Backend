import { cartController } from '../controllers/index.js';

import { Router } from 'express';

const router = Router();

router.post('/', cartController.createCart);

router.get('/:cid', cartController.getCartById);

router.post('/:cid/product/:pid', cartController.addProductToCartId);

router.put('/:cid', cartController.updateProducts);

router.put('/:cid/product/:pid', cartController.updateProductQuantity);

router.delete('/:cid/product/:pid', cartController.removeProductFromCartId);

router.delete('/:cid', cartController.clearCartById);

export default router;
