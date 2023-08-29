class Cart {
    static nextId = 1;

    constructor(id = null, products = []) {
        if (id !== null) {
            this.id = id;
            if (id > Cart.nextId) Cart.nextId = id;
        } else {
            this.id = Cart.nextId;
        }

        this.products = products;

        Cart.nextId++;
    }

    static fromObject({ id, products }) {
        return new Cart(id, products);
    }

    update({ products }) {
        this.products = products || this.products;
    }
}

export default Cart;
