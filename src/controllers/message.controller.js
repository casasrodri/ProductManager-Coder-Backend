import MessageService from '../services/message.service.js';

const messageService = new MessageService();

export default class MessageController {
    async addMessage(user, name, text) {
        return await messageService.addMessage(user, name, text);
    }

    async getMessages() {
        return await messageService.getMessages();
    }

    getId(id) {
        return messageService.getId(id);
    }
}
