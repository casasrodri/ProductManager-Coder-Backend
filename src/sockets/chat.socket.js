import MessageManager from '../dao/mongo/controllers/messsageManager.js';
const mm = new MessageManager();

export default (socketServer) => {
    socketServer.on('connection', (socket) => {
        console.log('[Chat] New connection', socket.id);

        socket.on('newMessage', async (user, text) => {
            await mm.addMessage(user, text);
            socketServer.emit('allMessages', await mm.getMessages());
        });
    });
};
