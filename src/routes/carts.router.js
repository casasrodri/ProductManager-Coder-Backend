import { Router } from '../services/errors/customRouter.js';
import { cartController } from '../controllers/index.js';

const router = Router();

router.post('/', cartController.createCart);

router.get('/:cid', cartController.getCartById);

router.put('/:cid', cartController.updateProducts);

router.delete('/:cid', cartController.clearCartById);

router.post('/:cid/product/:pid', cartController.addProductToCartId);

router.put('/:cid/product/:pid', cartController.updateProductQuantity);

router.delete('/:cid/product/:pid', cartController.removeProductFromCartId);

router.post('/:cid/purchase', cartController.purchaseCartById);

export default router;
