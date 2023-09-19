import Message from '../models/message.js';

class MessageManager {
    async addMessage(user, text) {
        return await Message.create({ user, text });
    }

    async getMessages() {
        return await Message.find().lean();
    }

    getId(id) {
        return id;
    }
}

export default MessageManager;
