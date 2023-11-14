import CartRepository from './cart.repository.js';
import MessageRepository from './message.repository.js';
import ProductRepository from './product.repository.js';
import UserRepository from './user.repository.js';
import TicketRepository from './ticket.repository.js';

export const cartRepository = new CartRepository();
export const messageRepository = new MessageRepository();
export const productRepository = new ProductRepository();
export const userRepository = new UserRepository();
export const ticketRepository = new TicketRepository();
