import Message from '../models/message.js';

class MessageManager {
    async addMessage(user, name, text) {
        return await Message.create({ user, name, text });
    }

    async getMessages() {
        return await Message.find().lean();
    }

    getId(id) {
        return id;
    }
}

export default MessageManager;
