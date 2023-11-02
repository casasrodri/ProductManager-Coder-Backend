import CartController from '../controllers/cart.controller.js';
import { Router } from 'express';

const router = Router();
const cartController = new CartController();

router.post('/', async (req, res) => {
    const newCart = await cartController.addCart();
    res.status(201).send({
        status: 'ok',
        description: 'Cart created.',
        data: newCart,
    });
});

router.get('/:cid', async (req, res) => {
    const cid = cartController.getId(req.params.cid);
    try {
        const found = await cartController.getCartById(cid);
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
    const cid = cartController.getId(req.params.cid);
    const pid = cartController.getId(req.params.pid);

    try {
        return res.status(200).send({
            status: 'ok',
            description: 'Product added to cart.',
            data: await cartController.addProductToCartId(cid, pid),
        });
    } catch (err) {
        return res.status(404).send({
            status: 'error',
            description: err.message,
            data: { cartId: cid },
        });
    }
});

router.put('/:cid', async (req, res) => {
    const cid = cartController.getId(req.params.cid);
    const products = req.body.products;

    if (!products)
        return res.status(404).send({
            status: 'error',
            description: 'Products not found in body request.',
            data: { cartId: cid },
        });

    try {
        return res.status(200).send({
            status: 'ok',
            description: 'Products updated.',
            data: await cartController.updateProducts(cid, products),
        });
    } catch (err) {
        return res.status(404).send({
            status: 'error',
            description: err.message,
            data: { cartId: cid, products: products },
        });
    }
});

router.put('/:cid/product/:pid', async (req, res) => {
    const cid = cartController.getId(req.params.cid);
    const pid = cartController.getId(req.params.pid);
    const quantity = req.body.quantity;

    if (!quantity)
        return res.status(404).send({
            status: 'error',
            description: 'Quantity not found in body request.',
            data: { cartId: cid, productId: pid },
        });

    try {
        return res.status(200).send({
            status: 'ok',
            description: 'Quantity updated.',
            data: await cartController.updateProductQuantity(
                cid,
                pid,
                quantity
            ),
        });
    } catch (err) {
        return res.status(404).send({
            status: 'error',
            description: err.message,
            data: { cartId: cid, productId: pid, quantity: quantity },
        });
    }
});

router.delete('/:cid/product/:pid', async (req, res) => {
    const cid = cartController.getId(req.params.cid);
    const pid = cartController.getId(req.params.pid);

    try {
        await cartController.removeProductFromCartId(cid, pid);

        return res.status(200).send({
            status: 'ok',
            description: 'Product removed from cart.',
            data: { cartId: cid, productId: pid },
        });
    } catch (err) {
        return res.status(404).send({
            status: 'error',
            description: err.message,
            data: { cartId: cid, productId: pid },
        });
    }
});

router.delete('/:cid', async (req, res) => {
    const cid = cartController.getId(req.params.cid);

    try {
        await cartController.clearCartById(cid);

        return res.status(200).send({
            status: 'ok',
            description: 'All products have been removed from cart.',
            data: { cartId: cid },
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
