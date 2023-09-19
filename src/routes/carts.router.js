import { Router } from 'express';
// import CartManager from '../dao/fs/controllers/cartManager.js';
import CartManager from '../dao/mongo/controllers/cartManager.js';

// Instantiate the manager
const cm = new CartManager();

const router = Router();

router.post('/', async (req, res) => {
    const newCart = await cm.addCart();
    res.status(201).send({
        status: 'ok',
        description: 'Cart created.',
        data: newCart,
    });
});

router.get('/:cid', async (req, res) => {
    const cid = cm.getId(req.params.cid);
    try {
        const found = await cm.getCartById(cid);
        return res.status(200).send({
            status: 'ok',
            description: `Products in cart id=${cid}.`,
            data: found.products,
        });
    } catch (err) {
        return res.status(404).send({
            status: 'error',
            description: err.message,
            data: { cartId: cid },
        });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    const cid = cm.getId(req.params.cid);
    const pid = cm.getId(req.params.pid);

    try {
        return res.status(200).send({
            status: 'ok',
            description: 'Product added to cart.',
            data: await cm.addProductToCartId(cid, pid),
        });
    } catch (err) {
        return res.status(404).send({
            status: 'error',
            description: err.message,
            data: { cartId: cid },
        });
    }
});

export default router;
