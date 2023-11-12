import ProductRepository from '../repositories/product.repository.js';

const productRepository = new ProductRepository();

export default class ProductController {
    async addProduct(product) {
        return await productRepository.addProduct(product);
    }

    async getProducts() {
        return await productRepository.getProducts(product);
    }

    async getProductsPaginate(req) {
        return await productRepository.getProductsPaginate(req);
    }

    async getProductById(id) {
        return await productRepository.getProductById(id);
    }

    async updateProductById(id, updatedData) {
        return await productRepository.updateProductById(id, updatedData);
    }

    async addThumbnail(id, path) {
        return await productRepository.addThumbnail(id, path);
    }

    async deleteProductById(id) {
        return await productRepository.deleteProductById(id);
    }

    getId(id) {
        return productRepository.getId(id);
    }
}
