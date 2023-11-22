import { messageRepository } from '../repositories/index.js';
import logger from '../utils/logger.js';

export default (socketServer) => {
    socketServer.on('connection', async (socket) => {
        logger.http('[Chat] New connection', socket.id);
        socketServer.emit('allMessages', await messageRepository.getMessages());

        socket.on('newMessage', async (user, name, text) => {
            await messageRepository.addMessage(user, name, text);
            socketServer.emit(
                'allMessages',
                await messageRepository.getMessages()
            );
        });
    });
};
