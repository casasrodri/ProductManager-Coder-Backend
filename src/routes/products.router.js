import { Router } from 'express';
import ProductManager from '../controllers/productManager.js';

// Instantiate the manager
const pm = new ProductManager();

const router = Router();

router.get('/', async (req, res) => {
    const products = await pm.getProducts();
    const limit = parseInt(req.query.limit, 10);

    if (limit) {
        const limited = products.slice(0, limit);
        return res.send(limited);
    }

    res.send(products);
});

router.get('/:pid', async (req, res) => {
    const pid = parseInt(req.params.pid, 10);

    try {
        const product = await pm.getProductById(pid);
        res.send(product);
    } catch (err) {
        res.send({ productId: pid, status: 'Not found' });
    }
});

// TODO: Agregar un producto a la base de datos (lleva middleware multer, campo opcional)
// TODO: Ver especificaciones para cambiar en la clase Product.
router.post('/', (req, res) => {
    res.status(501).send();
});

// TODO: ruta para actualizar el producto:
router.put('/:pid', (req, res) => {
    res.status(501).send();
});

// TODO: ruta para eliminar el producto:
router.delete('/:pid', (req, res) => {
    res.status(501).send();
});

export default router;
