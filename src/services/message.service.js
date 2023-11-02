import Message from '../dao/mongo/models/message.js';

export default class MessageService {
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
