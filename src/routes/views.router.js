import { Router } from 'express';
import ProductManager from '../controllers/productManager.js';

const pm = new ProductManager();
const router = Router();

router.get('/', async (req, res) => {
    const products = await pm.getProducts();
    res.render('home', { products: products })
})

router.get('/realtimeproducts', async (req, res) => {
    const products = await pm.getProducts();
    res.render('realtimeproducts', { products: products })
});

export default router;
