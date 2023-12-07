import viewsRouter from './views.router.js';
import productsRouter from './products.router.js';
import cartsRouter from './carts.router.js';
import sessionsRouter from './sessions.router.js';
import usersRouter from './users.router.js';

export default (app) => {
    app.use('/', viewsRouter);
    app.use('/api/products', productsRouter);
    app.use('/api/carts', cartsRouter);
    app.use('/api/sessions', sessionsRouter);
    app.use('/api/users', usersRouter);
};
