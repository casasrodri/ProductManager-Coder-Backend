import { Router } from 'express';
const router = Router();

router.get('/', async (req, res) => {
    const products = await req.productManager.getProducts();
    res.render('home', { products: products });
});

router.get('/products', async (req, res) => {
    res.render('products');
});

router.get('/realtimeproducts', async (req, res) => {
    let products = await req.productManager.getProducts();

    products.forEach((product) => {
        if (!product.id) {
            product.id = product._id;
        }
    });

    res.render('realtimeproducts', { products: products });
});

router.get('/carts/:cid', (req, res) => {
    res.render('cartsId');
});

router.get('/chat', (req, res) => {
    res.render('chat');
});

export default router;
