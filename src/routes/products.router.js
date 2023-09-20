import { getBodyProduct } from '../middlewares/products.js';
import { thumbnailsUploader } from '../middlewares/multer.js';
import { Router } from 'express';
const router = Router();

router.get('/', async (req, res) => {
    let products = await req.productManager.getProducts();
    const limit = parseInt(req.query.limit);

    if (limit) {
        products = await req.productManager.getProductsLimit(limit);
    }

    if (products.length === 0) {
        return res.status(204).send(products);
    }

    res.send(products);
});

router.get('/:pid', async (req, res) => {
    const pid = req.productManager.getId(req.params.pid);

    try {
        const product = await req.productManager.getProductById(pid);
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
    try {
        return res.status(201).send({
            status: 'ok',
            description: 'Created.',
            data: await req.productManager.addProduct(req.body.product),
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
        const pid = req.productManager.getId(req.params.pid);

        try {
            for (const f of req.files) {
                await req.productManager.addThumbnail(pid, f.path);
            }

            const product = await req.productManager.getProductById(pid);

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
    const pid = req.productManager.getId(req.params.pid);
    const updatedProduct = req.body.product;
    let updated;

    try {
        return res.status(200).send({
            status: 'ok',
            description: 'Updated.',
            data: await req.productManager.updateProductById(
                pid,
                updatedProduct
            ),
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
    const pid = req.productManager.getId(req.params.pid);

    try {
        return res.status(204).send({
            status: 'ok',
            description: 'Deleted.',
            data: await req.productManager.deleteProductById(pid),
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
