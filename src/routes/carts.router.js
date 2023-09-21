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
    // TODO: Hacer un populate de los productos del carrito.
    // FIXME: EL populate se hace en el endpoint o en el manager?

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
    // TODO: Actualizar todos los productos del carrito con id = cid.
    // Recibir el arreglo de productos con el formato correspondiente.
});

router.put('/:cid/product/:pid', async (req, res) => {
    // TODO: Actualizar SOLO la cantidad del producto con id = pid del carrito con id = cid.
});

router.delete('/:cid/product/:pid', async (req, res) => {
    // TODO: Eliminar del carrito el producto con id = pid.
});

router.delete('/:cid', async (req, res) => {
    // TODO: Eliminar todos los productos del carrito con id = cid.
});

export default router;
