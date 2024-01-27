import { fakerES_MX as faker } from '@faker-js/faker';

export function generateMockProducts(n) {
    const products = [];
    for (let i = 0; i < n; i++) {
        const product = {
            title: faker.commerce.product(),
            description: faker.commerce.productDescription(),
            code: faker.string.alpha(10),
            price: faker.commerce.price(),
            stock: faker.number.int({ min: 10, max: 300 }),
            category: faker.commerce.department(),
            thumbnails: [faker.image.url()],
            status: faker.datatype.boolean(),
        };
        products.push(product);
    }
    return products;
}
