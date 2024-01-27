import Ticket from '../dao/mongo/models/ticket.js';

export default class TicketRepository {
    async createTicket(ticket) {
        return await Ticket.create(ticket);
    }
}
