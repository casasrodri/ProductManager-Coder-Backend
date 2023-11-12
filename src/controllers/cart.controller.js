import CartRepository from '../repositories/cart.repository.js';

const cartRepository = new CartRepository();

export default class CartController {
    async addCart() {
        return await cartRepository.addCart();
    }

    async getCartById(id) {
        return await cartRepository.getCartById(id);
    }

    async clearCartById(id) {
        return await cartRepository.clearCartById(id);
    }

    async addProductToCartId(cartId, productId) {
        return await cartRepository.addProductToCartId(cartId, productId);
    }

    async removeProductFromCartId(cartId, productId) {
        return await cartRepository.removeProductFromCartId(cartId, productId);
    }

    async updateProductQuantity(cartId, productId, quantity) {
        return await cartRepository.updateProductQuantity(
            cartId,
            productId,
            quantity
        );
    }

    async updateProducts(cartId, products) {
        return await cartRepository.updateProducts(cartId, products);
    }

    getId(id) {
        return cartRepository.getId(id);
    }
}
