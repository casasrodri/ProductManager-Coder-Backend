import MessageRepository from '../repositories/message.repository.js';

const messageRepository = new MessageRepository();

export default class MessageController {
    async addMessage(user, name, text) {
        return await messageRepository.addMessage(user, name, text);
    }

    async getMessages() {
        return await messageRepository.getMessages();
    }

    getId(id) {
        return messageRepository.getId(id);
    }
}
