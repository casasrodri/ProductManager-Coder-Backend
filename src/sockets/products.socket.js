import { Server } from 'socket.io';

export default (httpServer) => {
    // Socket server
    const socketServer = new Server(httpServer);

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
};
