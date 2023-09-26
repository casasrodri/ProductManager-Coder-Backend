import { Router } from 'express';
const router = Router();

router.post('/', async (req, res) => {
    const newCart = await req.cartManager.addCart();
    res.status(201).send({
        status: 'ok',
        description: 'Cart created.',
        data: newCart,
    });
});

router.get('/:cid', async (req, res) => {
    const cid = req.cartManager.getId(req.params.cid);
    try {
        const found = await req.cartManager.getCartById(cid);
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
    const cid = req.cartManager.getId(req.params.cid);
    const pid = req.cartManager.getId(req.params.pid);

    try {
        return res.status(200).send({
            status: 'ok',
            description: 'Product added to cart.',
            data: await req.cartManager.addProductToCartId(cid, pid),
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
    const cid = req.cartManager.getId(req.params.cid);
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
            data: await req.cartManager.updateProducts(cid, products),
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
    const cid = req.cartManager.getId(req.params.cid);
    const pid = req.cartManager.getId(req.params.pid);
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
            data: await req.cartManager.updateProductQuantity(
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
    const cid = req.cartManager.getId(req.params.cid);
    const pid = req.cartManager.getId(req.params.pid);

    try {
        await req.cartManager.removeProductFromCartId(cid, pid);

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
    const cid = req.cartManager.getId(req.params.cid);

    try {
        await req.cartManager.clearCartById(cid);

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
