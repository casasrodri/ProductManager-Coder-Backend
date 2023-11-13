import Cart from '../dao/mongo/models/cart.js';

export default class CartRepository {
    async addCart() {
        return await Cart.create({ products: [] });
    }

    async getCartById(id) {
        const found = Cart.findById(id).populate('products.product').exec();

        if (!found) throw new Error(`Cart with id=${id}: Not found.`);
        return found;
    }

    async clearCartById(id) {
        const cart = await this.getCartById(id);

        cart.products = [];
        await cart.save();
        return cart;
    }

    async addProductToCartId(cartId, productId) {
        const cart = await this.getCartById(cartId);

        let item = cart.products.find((p) => p.product._id == productId);

        if (item) {
            item.quantity++;
        } else {
            item = { product: productId, quantity: 1 };
            cart.products.push(item);
        }

        await cart.save();
        return item;
    }

    async removeProductFromCartId(cartId, productId) {
        const cart = await this.getCartById(cartId);

        cart.products = cart.products.filter((p) => p.product._id != productId);

        await cart.save();
        return cart;
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await this.getCartById(cartId);

        const item = cart.products.find((p) => p.product._id == productId);

        if (!item)
            throw new Error(
                `Product with id=${productId} not found in cart with id=${cartId}.`
            );

        item.quantity = quantity;

        await cart.save();
        return item;
    }

    async updateProducts(cartId, products) {
        const cart = await this.getCartById(cartId);

        cart.products = products;

        await cart.save();
        return cart;
    }

    getId(id) {
        return id;
    }
}
