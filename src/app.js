import { log } from 'node:console';
import express from 'express';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import gui from './routes/gui.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

// Instantiate the express application:
const app = express();
const httpServer = app.listen(8080, () => log('🚀 Server listening on http://localhost:8080'));

// Socket server
const io = new Server(httpServer);

// Handlebars configuration
app.engine('handlebars', handlebars.engine());
app.set('views', process.cwd() + '/src/views');
app.set('view engine', 'handlebars');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(process.cwd() + '/public'));

// Using routers
app.use('/', gui);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

