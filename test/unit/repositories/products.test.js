import { connectMongo } from '../../../src/dao/mongo/singleton.js'
import { v4 } from 'uuid';
import { productRepository } from '../../../src/repositories/index.js'
import Assert from 'assert'

const assert = Assert.strict


describe('Product Repository', () => {
    before(function connectMongoDB() {
        connectMongo();
    })

    context('when getting products', () => {
        let products

        before(async function () {
            this.timeout(5000);
            products = await productRepository.getProducts()
        })

        it('should get an array of products', async function () {
            assert.ok(Array.isArray(products))
        })

        it('should get an array with at least 1 product', async () => {
            assert.ok(products.length > 0)
        })

        it('should get a product by id', async () => {
            const product = await productRepository.getProductById(products[0]._id)
            assert.ok(product)
        })

    })

    context('when adding a new product', () => {
        let mockProduct
        let newProduct
        let newProduct2

        before(async () => {
            mockProduct = {
                title: 'Test Product',
                description: 'Test Product',
                code: v4(),
                price: 100,
                stock: 10,
                category: 'Test',
                thumbnails: ['test'],
                status: true,
                owner: 'test@test.com',
            }

            newProduct = await productRepository.addProduct(mockProduct)
        })

        it('should add a product', async () => {
            assert.ok(newProduct._id)
        })

        it('should raise an error for duplicated code', async () => {
            try {
                newProduct2 = await productRepository.addProduct(mockProduct)
            } catch (err) {
                const codeDescription = err.message.includes('already exists')
                const codeInError = err.message.includes(mockProduct.code)
                assert.ok(codeDescription && codeInError)
            }

            assert.ok(newProduct2 === undefined)
        })

        after(async () => {
            await productRepository.deleteProductById(newProduct._id)
        })
    })
})
