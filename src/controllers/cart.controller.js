import {
    cartRepository,
    userRepository,
    productRepository,
    ticketRepository,
} from '../repositories/index.js';

import { CustomError, errorTypes, getCartErrorInfo } from '../services/errors/customError.js';

import sendEmail from '../services/emailing.js';

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

            throw new CustomError({
                name: 'GetCartByIdError',
                message: getCartErrorInfo(cid),
                cause: err.message,
                type: errorTypes.DATABASE,
                statusCode: 404,
            });
        }
    }

    async addProductToCartId(req, res) {
        const cid = cartRepository.getId(req.params.cid);
        const pid = cartRepository.getId(req.params.pid);
        const product = await productRepository.getProductById(pid)

        if (product.owner === req.user.email) {
            return res.status(403).send({
                status: 'error',
                description: 'You can\'t add your own product to your cart.',
                data: { cartId: cid, productId: pid },
            });
        }

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

    async purchaseCartById(req, res) {
        const cid = await cartRepository.getId(req.params.cid);
        const cart = await cartRepository.getCartById(cid);

        // Check if user exists
        const userEmail = req.body.purchaser;
        const user = await userRepository.getByEmail(userEmail);

        if (!user) {
            return res.status(404).send({
                status: 'error',
                description: 'User does not exist.',
                data: { userEmail },
            });
        }

        const productsInTicket = [];
        const productsNotInTicket = [];
        let total = 0;

        for (const element of cart.products) {
            const stock = element.product.stock;
            const required = element.quantity;
            const price = element.product.price;
            const product = await productRepository.getProductById(
                element.product._id
            );

            if (stock >= required) {
                // Stock updated
                product.stock -= required;
                product.save();

                // Product added to ticket
                productsInTicket.push(element);
                cartRepository.removeProductFromCartId(
                    cid,
                    element.product._id
                );

                total += required * price;
            } else {
                productsNotInTicket.push(element);
            }
        }

        // Save changes in cart
        cart.products = productsNotInTicket;
        cart.save();

        // Create ticket
        const ticket = await ticketRepository.createTicket({
            purchaser: user.email,
            amount: total,
        });

        // Send email
        let emailBody = `Hello ${user.first_name}!\n`;
        emailBody += 'You have purchased the following products:\n';

        for (const element of productsInTicket) {
            emailBody += `${element.product.title} (${element.quantity} x $${element.product.price})\n`;
        }

        emailBody += `\nTOTAL: $${total}\n\n`;
        emailBody += 'Sadly, the following products were not available:\n';

        for (const element of productsNotInTicket) {
            emailBody += `${element.product.title} (You want ${element.quantity}, but we have ${element.product.stock})\n`;
        }

        emailBody += 'Go to the store to check if they are available now.\n\n';
        emailBody += 'Thanks for your purchase!\n';
        emailBody += 'Kind regards,\n\n';
        emailBody += 'The team at E-Commerce\n';

        sendEmail(user.email, `Ticket #${ticket.code}`, emailBody);

        return res.status(200).send({
            status: 'success',
            description: 'The cart was purchased.',
            data: { ticket, productsInTicket, productsNotInTicket },
        });
    }
}
