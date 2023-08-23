import { log } from 'node:console';
import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

// Instantiate the application:
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static('public'));

// Endpoints definition
app.get('/', (req, res) => {
    // TODO: Documentacion APIs
    res.send(`
        <h1>Available endpoints:</h1>
        <ul>
            <li><a href="/">/</a>: Main page.</li>
            <li><a href="/products">/products</a>: Show all products.</li>
            <li><a href="/products?limit=2">/products?limit=2:</a>: Show list of products
            based on a limit.</li>
            <li><a href="/products/3">/products/3</a>: Show a product based on the id.</li>
        </ul>
    `);
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(8080, () => log('🚀 Server listening on http://localhost:8080'));
