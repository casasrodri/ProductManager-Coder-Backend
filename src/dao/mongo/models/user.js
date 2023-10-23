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
        enum: ['admin', 'user'],
        default: 'user',
    },
    cart: {
        type: mongoose.Types.ObjectId,
        ref: 'carts',
    },
});

const User = mongoose.model(userCollection, userSchema);

export default User;
