import { Router } from 'express';
import CartManager from '../controllers/cartManager.js';
import { parseCartId } from '../middlewares/carts.js';
import { parseProductId } from '../middlewares/products.js';

// Instantiate the manager
const cm = new CartManager();

const router = Router();

router.post('/', async (req, res) => {
    const newCart = await cm.addCart();
    res.status(201).send(newCart);
});

router.get('/:cid', parseCartId, async (req, res) => {
    const cid = req.params.cid;
    try {
        const found = await cm.getCartById(cid);
        return res.status(200).send(found.products);
    } catch (err) {
        console.log('Entró en el error.');
        return res.status(404).send({
            status: 'error',
            description: err.message,
            data: { cartId: cid },
        });
    }
});

router.post(
    '/:cid/product/:pid',
    parseCartId,
    parseProductId,
    async (req, res) => {
        const cid = req.params.cid;
        const pid = req.params.pid;

        let result;

        try {
            result = await cm.addProductToCartId(cid, pid);
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                description: err.message,
                data: { cartId: cid },
            });
        }

        res.status(200).send({
            status: 'ok',
            description: 'Product added.',
            data: result,
        });
    }
);

export default router;
