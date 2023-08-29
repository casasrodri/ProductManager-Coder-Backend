import { Router } from 'express';
import ProductManager from '../controllers/productManager.js';
import Product from '../models/product.js';
import { parseProductId, getBodyProduct } from '../middlewares/products.js';

// Instantiate the manager
const pm = new ProductManager();

const router = Router();

router.get('/', async (req, res) => {
    let products = await pm.getProducts();
    const limit = parseInt(req.query.limit, 10);

    if (limit) {
        products = products.slice(0, limit);
    }

    if (products === []) {
        return res.status(204).send();
    }

    res.send(products);
});

router.get('/:pid', parseProductId, async (req, res) => {
    const pid = req.params.pid;

    try {
        const product = await pm.getProductById(pid);
        res.send(product);
    } catch (err) {
        res.status(404).send({ productId: pid, status: 'Not found' });
    }
});

// TODO: Agregar un producto a la base de datos (lleva middleware multer, campo opcional)
router.post('/', getBodyProduct, async (req, res) => {
    let newProduct;

    const {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
    } = req.body.product;

    try {
        newProduct = new Product(
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        );
    } catch (err) {
        return res.status(400).send({
            status: 'error',
            description:
                'Can not create a new product. Verify you are sending all the necesary fields.',
        });
    }

    try {
        await pm.addProduct(newProduct);
    } catch (err) {
        return res.status(400).send({
            status: 'error',
            description:
                'Can not add a new product. The code already exists for the product.',
        });
    }

    res.status(201).send({
        status: 'ok',
        description: 'Created.',
        data: newProduct,
    });
});

router.put('/:pid', parseProductId, getBodyProduct, async (req, res) => {
    const pid = req.params.pid;
    const updatedProduct = req.body.product;
    let updated;

    try {
        updated = await pm.updateProductById(pid, updatedProduct);
    } catch (err) {
        return res.status(404).send({ productId: pid, status: 'Not found' });
    }

    res.status(200).send({
        status: 'ok',
        description: 'Updated.',
        data: updated,
    });
});

router.delete('/:pid', parseProductId, async (req, res) => {
    const pid = req.params.pid;
    let deleted;

    try {
        deleted = await pm.deleteProductById(pid);
    } catch (err) {
        return res.status(404).send({ productId: pid, status: 'Not found' });
    }

    return res.status(204).send({
        status: 'ok',
        description: 'Deleted.',
        data: deleted,
    });
});

export default router;
