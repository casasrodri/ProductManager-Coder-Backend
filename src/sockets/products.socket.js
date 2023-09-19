export default (socketServer) => {
    socketServer.on('connection', (socket) => {
        console.log('[Product] New connection', socket.id);

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
