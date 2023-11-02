import MessageController from '../controllers/message.controller.js';
const messageController = new MessageController();

export default (socketServer) => {
    socketServer.on('connection', async (socket) => {
        console.log('[Chat] New connection', socket.id);
        socketServer.emit('allMessages', await messageController.getMessages());

        socket.on('newMessage', async (user, name, text) => {
            await messageController.addMessage(user, name, text);
            socketServer.emit(
                'allMessages',
                await messageController.getMessages()
            );
        });
    });
};
