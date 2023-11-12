import { cartRepository } from '../repositories/index.js';

export default class CartController {
    async createCart(req, res) {
        const newCart = await cartRepository.addCart();
        res.status(201).send({
            status: 'ok',
            description: 'Cart created.',
            data: newCart,
        });
    }

    async getCartById(req, res) {
        const cid = cartRepository.getId(req.params.cid);
        try {
            const found = await cartRepository.getCartById(cid);
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
    }

    async addProductToCartId(req, res) {
        const cid = cartRepository.getId(req.params.cid);
        const pid = cartRepository.getId(req.params.pid);

        try {
            return res.status(200).send({
                status: 'ok',
                description: 'Product added to cart.',
                data: await cartRepository.addProductToCartId(cid, pid),
            });
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                description: err.message,
                data: { cartId: cid },
            });
        }
    }

    async updateProducts(req, res) {
        const cid = cartRepository.getId(req.params.cid);
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
                data: await cartRepository.updateProducts(cid, products),
            });
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                description: err.message,
                data: { cartId: cid, products: products },
            });
        }
    }

    async updateProductQuantity(req, res) {
        const cid = cartRepository.getId(req.params.cid);
        const pid = cartRepository.getId(req.params.pid);
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
                data: await cartRepository.updateProductQuantity(
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
    }

    async removeProductFromCartId(req, res) {
        const cid = cartRepository.getId(req.params.cid);
        const pid = cartRepository.getId(req.params.pid);

        try {
            await cartRepository.removeProductFromCartId(cid, pid);

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
    }

    async clearCartById(req, res) {
        const cid = cartRepository.getId(req.params.cid);

        try {
            await cartRepository.clearCartById(cid);

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
    }
}
