import { Router } from 'express';
// import ProductManager from '../dao/mongo/controllers/productManager.js';
import ProductManager from '../dao/fs/controllers/productManager.js';

const pm = new ProductManager();
const router = Router();

router.get('/', async (req, res) => {
    const products = await pm.getProducts();
    res.render('home', { products: products });
});

router.get('/realtimeproducts', async (req, res) => {
    let products = await pm.getProducts();

    products.forEach((product) => {
        if (!product.id) {
            product.id = product._id;
        }
    });

    res.render('realtimeproducts', { products: products });
});

export default router;
