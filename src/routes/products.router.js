import { Router } from '../services/errors/customRouter.js';
import { getBodyProduct } from '../middlewares/products.js';
import { thumbnailsUploader } from '../middlewares/multer.js';
import { productController } from '../controllers/index.js';

const router = Router();

router.get('/', productController.getProductsPaginate);

router.post('/', getBodyProduct, productController.addProduct);

router.get('/:pid', productController.getProductById);

router.put('/:pid', getBodyProduct, productController.updateProductById);

router.delete('/:pid', productController.deleteProductById);

router.post(
    '/:pid/thumbnails',
    thumbnailsUploader.array('thumbnails'),
    productController.addThumbnail
);

export default router;
