import { log } from 'node:console';
import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

// Instantiate the express application:
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(process.cwd() + '/public'));

// Using routers
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(8080, () => log('🚀 Server listening on http://localhost:8080'));
