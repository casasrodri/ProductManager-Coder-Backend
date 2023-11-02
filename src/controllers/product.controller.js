import ProductService from '../services/product.service.js';

const productService = new ProductService();

export default class ProductController {
    async addProduct(product) {
        return await productService.addProduct(product);
    }

    async getProducts() {
        return await productService.getProducts(product);
    }

    async getProductsPaginate(req) {
        return await productService.getProductsPaginate(req);
    }

    async getProductById(id) {
        return await productService.getProductById(id);
    }

    async updateProductById(id, updatedData) {
        return await productService.updateProductById(id, updatedData);
    }

    async addThumbnail(id, path) {
        return await productService.addThumbnail(id, path);
    }

    async deleteProductById(id) {
        return await productService.deleteProductById(id);
    }

    getId(id) {
        return productService.getId(id);
    }
}
