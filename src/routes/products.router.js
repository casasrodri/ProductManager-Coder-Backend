import { Router } from 'express';
import ProductManager from '../dao/fs/controllers/productManager.js';
import Product from '../dao/fs/models/product.js';
import { getBodyProduct } from '../middlewares/products.js';
import { thumbnailsUploader } from '../middlewares/multer.js';

// Instantiate the manager
const pm = new ProductManager();

const router = Router();

router.get('/', async (req, res) => {
    let products = await pm.getProducts();
    const limit = parseInt(req.query.limit);

    if (limit) {
        products = products.slice(0, limit);
    }

    if (products === []) {
        return res.status(204).send(products);
    }

    res.send(products);
});

router.get('/:pid', async (req, res) => {
    const pid = parseInt(req.params.pid);

    try {
        const product = await pm.getProductById(pid);
        res.send(product);
    } catch (err) {
        res.status(404).send({
            status: 'error',
            description: err.message,
            data: { productId: pid },
        });
    }
});

router.post('/', getBodyProduct, async (req, res) => {
    let newProduct;

    // Create product
    try {
        newProduct = Product.fromObject(req.body.product);
    } catch (err) {
        return res.status(400).send({
            status: 'error',
            description: 'Can not create a new product. ' + err.message,
            data: null,
        });
    }

    // Save product
    try {
        return res.status(201).send({
            status: 'ok',
            description: 'Created.',
            data: await pm.addProduct(newProduct),
        });
    } catch (err) {
        return res.status(400).send({
            status: 'error',
            description: 'Can not add a new product. ' + err.message,
            data: null,
        });
    }
});

router.post(
    '/:pid/thumbnails',
    thumbnailsUploader.array('thumbnails'),
    async (req, res) => {
        const pid = parseInt(req.params.pid);

        try {
            for (const f of req.files) {
                await pm.addThumbnail(pid, f.path);
            }

            const product = await pm.getProductById(pid);

            return res.status(201).send({
                status: 'ok',
                description: 'Thumbnails added.',
                data: product,
            });
        } catch (err) {
            return res.status(404).send({
                productId: pid,
                status: err.message,
                data: { productId: pid },
            });
        }
    }
);

router.put('/:pid', getBodyProduct, async (req, res) => {
    const pid = parseInt(req.params.pid);
    const updatedProduct = req.body.product;
    let updated;

    try {
        return res.status(200).send({
            status: 'ok',
            description: 'Updated.',
            data: await pm.updateProductById(pid, updatedProduct),
        });
    } catch (err) {
        return res.status(404).send({
            status: 'error',
            description: err.message,
            data: { productId: pid },
        });
    }
});

router.delete('/:pid', async (req, res) => {
    const pid = parseInt(req.params.pid);

    try {
        return res.status(204).send({
            status: 'ok',
            description: 'Deleted.',
            data: await pm.deleteProductById(pid),
        });
    } catch (err) {
        return res.status(404).send({
            status: 'error',
            description: err.message,
            data: { productId: pid },
        });
    }
});

export default router;
