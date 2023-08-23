class Product {
    static nextId = 1;

    constructor(title, description, price, thumbnail, code, stock, id = null) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error(
                'All the arguments must be passed to the constructor method.'
            );
        }

        if (id !== null) {
            this.id = id;
            if (id > Product.nextId) Product.nextId = id;
        }

        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;

        Product.nextId++;
    }

    static fromObject({
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        id,
    }) {
        return new Product(
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            id
        );
    }

    update({ title, description, price, thumbnail, code, stock }) {
        this.title = title || this.title;
        this.description = description || this.description;
        this.price = price || this.description;
        this.thumbnail = thumbnail || this.thumbnail;
        this.code = code || this.code;
        this.stock = stock || this.stock;
    }
}

export default Product;
