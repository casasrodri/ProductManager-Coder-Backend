import { Router } from '../services/errors/customRouter.js';
import { getBodyProduct } from '../middlewares/products.js';
import { thumbnailsUploader } from '../middlewares/multer.js';
import { productController } from '../controllers/index.js';
import authRole from '../middlewares/authorization.js';

const router = Router();
router.use(getBodyProduct)

router.get('/', productController.getProductsPaginate);

router.post('/', authRole(['admin', 'premium']), productController.addProduct);

router.get('/:pid', productController.getProductById);

router.put('/:pid', authRole(['admin', 'premium']), productController.updateProductById);

router.delete('/:pid', authRole(['admin', 'premium']), productController.deleteProductById);

router.post(
    '/:pid/thumbnails',
    thumbnailsUploader.array('thumbnails'),
    productController.addThumbnail
);

export default router;
