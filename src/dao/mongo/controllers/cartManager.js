import Cart from '../models/cart.js';

class CartManager {
    async addCart() {
        return await Cart.create({ products: [] });
    }

    async getCartById(id) {
        const found = Cart.findById(id);

        if (!found) throw new Error(`Cart with id=${id}: Not found.`);
        return found;
    }

    async addProductToCartId(cartId, productId) {
        const cart = await this.getCartById(cartId);

        let item = cart.products.find((p) => p.product == productId);

        if (item) {
            item.quantity++;
        } else {
            item = { product: productId, quantity: 1 };
            cart.products.push(item);
        }

        await cart.save();
        return item;
    }

    getId(id) {
        return id;
    }
}

export default CartManager;
