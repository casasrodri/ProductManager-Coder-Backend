// import ProductManagerMongo from '../dao/mongo/managers/product.manager.js';
// import ProductManagerFs from '../dao/fs/managers/product.manager.js';
// const productManager = new ProductManagerMongo();

import Product from '../dao/mongo/models/product.js';
import { createLink } from '../utils/pagination.js';

export default class ProductRepository {
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

    async getProductsPaginate(req) {
        const options = req.query;

        const opts = {
            limit: parseInt(options.limit) || 10,
            page: parseInt(options.page) || 1,
            query: {},
            lean: true,
            customLabels: { docs: 'payload' },
        };

        if (options.query) {
            const [key, value] = options.query.split(':');

            // [example] category:habitac | category:jard
            if (key === 'category') {
                opts.query = { category: { $regex: value, $options: 'ix' } };
            }

            // [example] available:true | available:false
            if (key === 'available') {
                if (value === 'true') {
                    opts.query = { stock: { $gt: 0 } };
                } else {
                    opts.query = { stock: { $eq: 0 } };
                }
            }
        }

        // [example] sort:desc | sort:asc
        if (options.sort) {
            opts.sort = options.sort === 'asc' ? 'price' : '-price';
        }

        const result = await Product.paginate(opts.query, opts);

        result['status'] = 'success';
        result['prevLink'] = createLink(result, req, 'prev');
        result['nextLink'] = createLink(result, req, 'next');

        return result;
    }

    async getProductById(id) {
        const found = Product.findById(id);

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

        found.thumbnails.push(path);
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
