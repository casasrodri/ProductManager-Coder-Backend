import { Router } from '../services/errors/customRouter.js';
import { getBodyProduct } from '../middlewares/products.js';
import { thumbnailsUploader } from '../middlewares/multer.js';
import { productController } from '../controllers/index.js';

const router = Router();

router.get('/', productController.getProductsPaginate);

router.get('/:pid', productController.getProductById);

router.post('/', getBodyProduct, productController.addProduct);

router.post(
    '/:pid/thumbnails',
    thumbnailsUploader.array('thumbnails'),
    productController.addThumbnail
);

router.put('/:pid', getBodyProduct, productController.updateProductById);

router.delete('/:pid', productController.deleteProductById);

export default router;
