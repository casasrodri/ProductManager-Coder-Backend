import logger from '../utils/logger.js';

export default (socketServer) => {
    socketServer.on('connection', (socket) => {
        logger.info('[Product] New connection', socket.id);

        socket.on('deleteProduct', (id) => {
            logger.info('Delete product', id);
            socketServer.emit('deletedProduct', id);
        });

        socket.on('editProduct', (product) => {
            logger.info('Edited product', product);
            socketServer.emit('editedProduct', product);
        });

        socket.on('newProduct', (product) => {
            logger.info('Added product', product);
            socketServer.emit('addedProduct', product);
        });
    });
};
