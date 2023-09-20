import { log } from 'node:console';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import Product from '../models/product.js';

class ProductManager {
    constructor() {
        this.path = 'src/dao/fs/databases/products.json';
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

        const newProduct = Product.fromObject(product);

        const exists = this.products.find((p) => p.code == newProduct.code);
        if (exists) {
            throw new Error(
                `The code "${newProduct.code}" already exists for the product ${newProduct.title} (id=${exists.id}).`
            );
        }

        newProduct.id = Product.nextId++;

        this.products.push(newProduct);
        await this.saveJson();
        return newProduct;
    }

    async getProducts() {
        await this.readJson();
        return this.products;
    }

    async getProductsLimit(limit) {
        await this.readJson();
        return this.products.slice(0, limit);
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

    async addThumbnail(id, path) {
        const found = await this.getProductById(id);
        found.addThumbnail(path);

        await this.saveJson();
        return found;
    }

    async deleteProductById(id) {
        const found = await this.getProductById(id);
        this.products = this.products.filter((p) => p !== found);

        await this.saveJson();
        return found;
    }

    getId(id) {
        return parseInt(id, 10);
    }
}

export default ProductManager;
