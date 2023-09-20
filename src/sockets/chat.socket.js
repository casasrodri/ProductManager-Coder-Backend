import MessageManager from '../dao/mongo/controllers/messsageManager.js';
const mm = new MessageManager();

export default (socketServer) => {
    socketServer.on('connection', async (socket) => {
        console.log('[Chat] New connection', socket.id);
        socketServer.emit('allMessages', await mm.getMessages());

        socket.on('newMessage', async (user, name, text) => {
            await mm.addMessage(user, name, text);
            socketServer.emit('allMessages', await mm.getMessages());
        });
    });
};
