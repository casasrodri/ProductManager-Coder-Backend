import { Router } from 'express';
const router = Router();

router.get('/', async (req, res) => {
    const products = await req.productManager.getProducts();
    res.render('home', { products: products });
});

router.get('/products', async (req, res) => {
    try {
        res.render(
            'products',
            await req.productManager.getProductsPaginate(req)
        );
    } catch (err) {
        return res
            .status(404)
            .send({ status: 'error', description: err.message, payload: [] });
    }
});

router.get('/realtimeproducts', async (req, res) => {
    let products = await req.productManager.getProducts();

    products.forEach((product) => {
        if (!product.id) {
            product.id = product._id;
        }
    });

    res.render('realTimeProducts', { products: products });
});

router.get('/carts/:cid', async (req, res) => {
    res.render('cart', { cid: req.params.cid });
});

router.get('/chat', (req, res) => {
    res.render('chat');
});

export default router;
