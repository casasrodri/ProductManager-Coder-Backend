import { log } from 'node:console';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import Product from '../models/product.js';

class ProductManager {
    constructor() {
        this.path = 'src/databases/products.json';
        this.products = [];

        if (!existsSync(this.path)) {
            this.saveJson();
        } else {
            this.readJson();
        }
    }

    async saveJson() {
        try {
            const productsJson = JSON.stringify(this.products, null, '\t');
            await writeFile(this.path, productsJson, 'utf-8');
        } catch (err) {
            log(err);
        }
    }

    async readJson() {
        const productsJson = await readFile(this.path, 'utf-8');
        const productsObj = JSON.parse(productsJson);
        this.products = productsObj.map((p) => Product.fromObject(p));

        let maxId = 0;
        this.products.forEach((p) => {
            if (p.id > maxId) maxId = p.id;
        });
        Product.nextId = maxId + 1;
    }

    async addProduct(product) {
        await this.readJson();

        if (this.products.find((p) => p.code == product.code)) {
            throw new Error(
                `The code "${product.code}" already exists for the product ${product.title}.`
            );
        }

        product.id = Product.nextId++;

        this.products.push(product);
        await this.saveJson();
        return product;
    }

    async getProducts() {
        await this.readJson();
        return this.products;
    }

    async getProductById(id) {
        await this.readJson();
        const found = this.products.find((p) => p.id === id);

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
        this.products = this.products.filter((p) => p !== found);

        await this.saveJson();
        return found;
    }
}

export default ProductManager;
