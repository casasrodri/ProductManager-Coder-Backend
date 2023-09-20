import Product from '../models/product.js';

class ProductManager {
    async addProduct(product) {
        const exists = await Product.findOne({ code: product.code });
        if (exists) {
            throw new Error(
                `The code "${product.code}" already exists for the product ${product.title} (id=${exists.id}).`
            );
        }

        return await Product.create(product);
    }

    async getProducts() {
        return await Product.find().lean();
    }

    async getProductById(id) {
        const found = Product.findById(id).lean();

        if (!found) throw new Error(`Product with id=${id}: Not found.`);
        return found;
    }

    async updateProductById(id, updatedData) {
        const updated = await Product.findByIdAndUpdate(id, updatedData, {
            returnDocument: 'after',
        });

        if (!updated)
            throw new Error(`Product with id=${id}: Not found. Cannot update.`);
        return updated;
    }

    async addThumbnail(id, path) {
        const found = await this.getProductById(id);

        found.thumbnail.push(path);
        found.save();

        return found;
    }

    async deleteProductById(id) {
        const deleted = Product.findByIdAndRemove(id);

        if (!deleted)
            throw new Error(`Product with id=${id}: Not found. Cannot delete.`);
        return deleted;
    }

    getId(id) {
        return id;
    }
}

export default ProductManager;
