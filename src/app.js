import { log } from 'node:console';
import express from 'express';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import views from './routes/views.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import mongoose from 'mongoose';

// Instantiate the express application:
const app = express();
const httpServer = app.listen(8080, () =>
    log('🚀 Server listening on http://localhost:8080')
);

// Socket server
const socketServer = new Server(httpServer);

// Connect to MongoDB
mongoose.connect(
    'mongodb+srv://rodri:rodri@cluster0.fhf3wmo.mongodb.net/ecommerce?retryWrites=true&w=majority'
);

// Handlebars configuration
app.engine('handlebars', handlebars.engine());
app.set('views', process.cwd() + '/src/views');
app.set('view engine', 'handlebars');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(process.cwd() + '/public'));

// Using routers
app.use('/', views);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Socket server configuration
socketServer.on('connection', (socket) => {
    console.log('New connection', socket.id);

    socket.on('deleteProduct', (id) => {
        console.log('Delete product', id);
        socketServer.emit('deletedProduct', id);
    });

    socket.on('editProduct', (product) => {
        console.log('Edited product', product);
        socketServer.emit('editedProduct', product);
    });

    socket.on('newProduct', (product) => {
        console.log('Added product', product);
        socketServer.emit('addedProduct', product);
    });
});
