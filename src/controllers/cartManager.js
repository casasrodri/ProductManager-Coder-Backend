import { log } from 'node:console';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import Cart from '../models/cart.js';

class CartManager {
    constructor() {
        this.path = 'src/databases/carrito.json';
        this.carts = [];

        if (!existsSync(this.path)) {
            this.saveJson();
        } else {
            this.readJson();
        }
    }

    async saveJson() {
        try {
            const cartsJson = JSON.stringify(this.carts, null, '\t');
            await writeFile(this.path, cartsJson, 'utf-8');
        } catch (err) {
            log(err);
        }
    }

    async readJson() {
        const cartsJson = await readFile(this.path, 'utf-8');
        const cartsObj = JSON.parse(cartsJson);
        this.carts = cartsObj.map((c) => Cart.fromObject(c));

        let maxId = 0;
        this.carts.forEach((c) => {
            if (c.id > maxId) maxId = c.id;
        });
        Cart.nextId = maxId + 1;
    }

    async addCart() {
        await this.readJson();

        const newCart = new Cart();
        this.carts.push(newCart);

        await this.saveJson();
        return newCart;
    }

    async getCartById(id) {
        await this.readJson();
        const found = this.carts.find((c) => c.id === id);

        if (!found) throw new Error(`Cart with id=${id}: Not found.`);
        return found;
    }

    async addProductToCartId(cartId, productId) {
        await this.readJson();

        const cart = await this.getCartById(cartId);

        let item = cart.products.find((p) => p.product == productId);

        if (item) {
            console.log('Entro aca', item);
            item.quantity++;
        } else {
            item = {
                product: productId,
                quantity: 1,
            };

            cart.products.push(item);
        }

        await this.saveJson();
        return item;
    }
}

export default CartManager;
