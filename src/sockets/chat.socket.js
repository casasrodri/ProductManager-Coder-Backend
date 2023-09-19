import MessageManager from '../dao/mongo/controllers/messsageManager.js';

export default (socketServer) => {
    socketServer.on('connection', (socket) => {
        console.log('[Chat] New connection', socket.id);

        socket.on('newMessage', async (user, text) => {
            await MessageManager.addMessage(user, text);
            socketServer.emit('messages', await MessageManager.getMessages());
        });
    });
};
