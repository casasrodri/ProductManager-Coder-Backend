import { expect, api } from './requester.js';
import { cartRepository } from '../../src/repositories/index.js';

describe('Carts Endpoints', () => {
    describe('POST /', () => {
        let response;
        let cart;

        before(async () => {
            response = await api.post('/api/carts');
            cart = response.body.data._id;
        });

        it('should return 201', () => {
            expect(response.status).to.equal(201);
        });

        it('should return the created cart', () => {
            const cart = response.body.data
            expect(cart).to.have.property('_id');
            expect(cart).to.have.property('products');
        });

        it('should return an empty cart', () => {
            const cart = response.body.data
            expect(cart.products).to.be.an('array');
            expect(cart.products).to.have.lengthOf(0);
        });
    });

    describe('GET /:cid', () => {
        let response;
        let cartId;

        before(async function () {
            response = await api.post('/api/carts');
            cartId = response.body.data._id;

            response = await api.get(`/api/carts/${cartId}`);
        });

        it('should return 200', () => {
            expect(response.status).to.equal(200);
        });

        it('should return an array with products', () => {
            expect(response.body.data).to.be.an('array');
        });
    });
});
