class Product {
    static nextId = 1;

    constructor(
        title,
        description,
        code,
        price,
        status = true,
        stock,
        category,
        thumbnails = [],
        id = null
    ) {
        if (!title || !description || !code || !price || !stock || !category) {
            throw new Error(
                `All the arguments must be passed to the constructor method.
                  - title: ${title}
                  - description: ${description}
                  - code: ${code}
                  - price: ${price}
                  - stock: ${stock}
                  - category: ${category}
                `
            );
        }

        if (id !== null) {
            this.id = id;
            if (id > Product.nextId) Product.nextId = id;
        }

        this.title = title;
        this.description = description;
        this.code = code;
        this.price = price;
        this.status = status;
        this.stock = stock;
        this.category = category;
        this.thumbnails = thumbnails;

        Product.nextId++;
    }

    static fromObject({
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
        id,
    }) {
        return new Product(
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails,
            id
        );
    }

    update({
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
    }) {
        this.title = title || this.title;
        this.description = description || this.description;
        this.code = code || this.code;
        this.price = price || this.description;
        this.status = status || this.status;
        this.stock = stock || this.stock;
        this.category = category || this.category;
        this.thumbnails = thumbnails || this.thumbnails;
    }

    addThumbnail(path) {
        this.thumbnails.push(path);
    }
}

export default Product;
