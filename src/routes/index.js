import viewsRouter from './views.router.js';
import productsRouter from './products.router.js';
import cartsRouter from './carts.router.js';

export default (app) => {
    app.use('/', viewsRouter);
    app.use('/api/products', productsRouter);
    app.use('/api/carts', cartsRouter);
};
