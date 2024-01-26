import { productRepository, userRepository } from '../repositories/index.js';
import { CustomError, errorTypes, createProductErrorInfo } from '../services/errors/customError.js';
import logger from '../utils/logger.js';
import sendEmail from '../services/emailing.js';
export default class ProductController {
    async getProductsPaginate(req, res) {
        try {
            res.send(await productRepository.getProductsPaginate(req));
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                description: err.message,
                payload: [],
            });
        }
    }

    async getProductById(req, res) {
        const pid = productRepository.getId(req.params.pid);

        try {
            const product = await productRepository.getProductById(pid);
            res.send(product);
        } catch (err) {
            res.status(404).send({
                status: 'error',
                description: err.message,
                data: { productId: pid },
            });
        }
    }

    async addProduct(req, res) {
        try {
            return res.status(201).send({
                status: 'ok',
                description: 'Created.',
                data: await productRepository.addProduct(req.product),
            });
        } catch (err) {

            throw new CustomError({
                name: 'AddProductError',
                message: createProductErrorInfo(req.product),
                cause: err.message,
                type: errorTypes.INVALID_TYPES,
                statusCode: 400,
            });
        }
    }

    async addThumbnail(req, res) {
        const pid = productRepository.getId(req.params.pid);

        try {
            for (const f of req.files) {
                await productRepository.addThumbnail(pid, f.path);
            }

            const product = await productRepository.getProductById(pid);

            return res.status(201).send({
                status: 'ok',
                description: 'Thumbnails added.',
                data: product,
            });
        } catch (err) {
            return res.status(404).send({
                productId: pid,
                status: err.message,
                data: { productId: pid },
            });
        }
    }

    async updateProductById(req, res) {
        const pid = productRepository.getId(req.params.pid);
        const updatedProduct = req.body.product;

        try {
            return res.status(200).send({
                status: 'ok',
                description: 'Updated.',
                data: await productRepository.updateProductById(
                    pid,
                    updatedProduct
                ),
            });
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                description: err.message,
                data: { productId: pid },
            });
        }
    }

    async deleteProductById(req, res) {
        const pid = productRepository.getId(req.params.pid);
        logger.warning('Deleting a product', pid)

        try {
            const deletedProduct = await productRepository.deleteProductById(pid)

            if (deletedProduct.owner) {
                const user = await userRepository.getByEmail(deletedProduct.owner)

                if (user.role === 'premium') {
                    logger.info('Sending email to premium user')

                    // Send email
                    let emailBody = `<p>Hello ${user.first_name}!</p>
                    <p>The following product has been deleted:</p>
                    <ul>
                        <li> Name: ${deletedProduct.title} </li>
                        <li> Description: ${deletedProduct.description} </li>
                        <li> Code: ${deletedProduct.code} </li>
                        <li> Stock: ${deletedProduct.stock} </li>
                        <li> Category: ${deletedProduct.category} </li>
                    </ul>

                    <p>
                        Kind regards,<br>
                        <b>The team at E-Commerce</b>
                    </p>
                    `
                    sendEmail(user.email, `Your product has been deleted`, emailBody);
                }
            }

            return res.status(204).send({
                status: 'ok',
                description: 'Deleted.',
                data: deletedProduct,
            });
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                description: err.message,
                data: { productId: pid },
            });
        }
    }
}
