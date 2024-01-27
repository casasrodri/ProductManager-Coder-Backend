import { ar } from '@faker-js/faker';
import mongoose from 'mongoose';

const userCollection = 'users';
const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    role: {
        type: String,
        enum: ['admin', 'user', 'premium'],
        default: 'user',
    },
    cart: {
        type: mongoose.Types.ObjectId,
        ref: 'carts',
    },
    documents: [
        {
            name: String,
            reference: String,
        },
    ],
    last_connection: Date,
});

const User = mongoose.model(userCollection, userSchema);

export default User;
