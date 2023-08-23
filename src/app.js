import { log } from 'node:console';
import { ProductManager } from './ProductManager.js';
import express from 'express';

// Instantiate the manager
const pm = new ProductManager();

// Instantiate the application:
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoints definition
app.get('/', (req, res) => {
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

app.get('/products', async (req, res) => {
    const products = await pm.getProducts();
    const limit = parseInt(req.query.limit, 10);

    if (limit) {
        const limited = products.slice(0, limit);
        return res.send(limited);
    }

    res.send(products);
});

app.get('/products/:pid', async (req, res) => {
    const pid = parseInt(req.params.pid, 10);

    try {
        const product = await pm.getProductById(pid);
        res.send(product);
    } catch (err) {
        res.send({ productId: pid, status: 'Not found' });
    }
});

app.listen(8080, () => log('Server listening on http://localhost:8080'));
