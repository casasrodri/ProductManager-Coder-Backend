import { Server } from 'socket.io';
import productsSocket from './products.socket.js';
import chatSocket from './chat.socket.js';

export default (httpServer) => {
    const socketServer = new Server(httpServer);

    productsSocket(socketServer);
    chatSocket(socketServer);
};
