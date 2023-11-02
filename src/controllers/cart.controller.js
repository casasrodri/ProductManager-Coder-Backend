import CartService from '../services/cart.service.js';

const cartService = new CartService();

export default class CartController {
    async addCart() {
        return await cartService.addCart();
    }

    async getCartById(id) {
        return await cartService.getCartById(id);
    }

    async clearCartById(id) {
        return await cartService.clearCartById(id);
    }

    async addProductToCartId(cartId, productId) {
        return await cartService.addProductToCartId(cartId, productId);
    }

    async removeProductFromCartId(cartId, productId) {
        return await cartService.removeProductFromCartId(cartId, productId);
    }

    async updateProductQuantity(cartId, productId, quantity) {
        return await cartService.updateProductQuantity(
            cartId,
            productId,
            quantity
        );
    }

    async updateProducts(cartId, products) {
        return await cartService.updateProducts(cartId, products);
    }

    getId(id) {
        return cartService.getId(id);
    }
}
