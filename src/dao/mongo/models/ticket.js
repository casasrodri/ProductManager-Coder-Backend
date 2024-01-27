import mongoose from 'mongoose';
import { v4 } from 'uuid';

const ticketCollection = 'tickets';
const ticketSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            unique: true,
        },
        purchase_datetime: {
            type: Date,
        },
        amount: Number,
        purchaser: {
            type: String,
            ref: 'users',
            required: true,
        },
    },
    { timestamps: true }
);

ticketSchema.pre('save', function (next) {
    this.code = v4();
    this.purchase_datetime = new Date();
    next();
});

const Ticket = mongoose.model(ticketCollection, ticketSchema);

export default Ticket;
