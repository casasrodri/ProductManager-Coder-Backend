import { log } from 'node:console';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';

class ProductManager {
    constructor() {
        this.path = './products.json'
        this.products = [];

        if (!existsSync(this.path)) {
            this.saveJson()
        } else {
            this.readJson()
        }
    }

    async saveJson() {
        try {
            const productsJson = JSON.stringify(this.products, null, '\t');
            await writeFile(this.path, productsJson, 'utf-8')
        } catch (err) {
            log(err);
        }
    }

    async readJson() {
        const productsJson = await readFile(this.path, 'utf-8');
        const productsObj = JSON.parse(productsJson);
        this.products = productsObj.map(p => Product.fromObject(p));

        let maxId = 0;
        this.products.forEach(p => {
            if (p.id > maxId) maxId = p.id;
        })
        Product.nextId = maxId + 1;
    }

    async addProduct(product) {

        await this.readJson();

        if (this.products.find(p => p.code == product.code)) {
            throw new Error(`The code "${product.code}" already exists for the product ${product.title}.`);
        }

        product.id = Product.nextId++;

        this.products.push(product);
        await this.saveJson();
        return product;
    }

    async getProducts() {
        await this.readJson()
        return this.products;
    }

    async getProductById(id) {
        await this.readJson();
        const found = this.products.find(p => p.id === id);

        if (!found) throw new Error(`Product with id=${id}: Not found.`);
        return found;
    }

    async updateProductById(id, updatedData) {
        const found = await this.getProductById(id);
        found.update(updatedData);

        await this.saveJson();
        return found;
    }

    async deleteProductById(id) {
        const found = await this.getProductById(id);
        this.products = this.products.filter(p => p !== found)

        await this.saveJson()
        return found;
    }

}

class Product {
    static nextId = 1;

    constructor(title, description, price, thumbnail, code, stock, id = null) {

        if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error('All the arguments must be passed to the constructor method.');
        }

        if (id !== null) {
            this.id = id;
            if (id > Product.nextId) Product.nextId = id
        }

        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;

        Product.nextId++;
    }

    static fromObject({ title, description, price, thumbnail, code, stock, id }) {
        return new Product(title, description, price, thumbnail, code, stock, id);
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

export { ProductManager, Product };
