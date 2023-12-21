import { expect, api } from './requester.js';
import { v4 } from 'uuid';

describe('Products Endpoints', () => {
    describe('POST /products', () => {
        context('when posting a product', async () => {
            let mockProduct;
            let response;

            before(async () => {
                mockProduct = {
                    title: 'Test Product',
                    description: 'Test Product',
                    code: v4(),
                    price: 100,
                    stock: 10,
                    category: 'Test',
                    thumbnails: ['test1', 'test2'],
                    status: true,
                    owner: 'test@test.com',
                }

                response = await api.post('/api/products').send(mockProduct);
            });

            it('should return 201', () => {
                expect(response.status).to.equal(201);
            });

            it('should return the created product', () => {
                const product = response.body.data
                expect(product).to.have.property('_id');
                expect(product).to.have.property('title', mockProduct.title);
                expect(product).to.have.property('description', mockProduct.description);
                expect(product).to.have.property('code', mockProduct.code);
                expect(product).to.have.property('price', mockProduct.price);
                expect(product).to.have.property('stock', mockProduct.stock);
                expect(product).to.have.property('category', mockProduct.category);
                expect(product).to.have.property('owner', mockProduct.owner);
                expect(product).to.have.property('thumbnails');
                expect(product.thumbnails).to.be.an('array');
                expect(product.thumbnails).to.have.lengthOf(2);
                expect(product.thumbnails).to.deep.equal(mockProduct.thumbnails);
            });

            it('should return the created product with status true', () => {
                const product = response.body.data
                expect(product).to.have.property('status', true);
            });

            after(async () => {
                await api.delete(`/api/products/${response.body.data._id}`);
            });
        });
    });
})
