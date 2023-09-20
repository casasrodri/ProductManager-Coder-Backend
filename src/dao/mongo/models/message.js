import mongoose from 'mongoose';

const messageCollection = 'messages';
const messageSchema = new mongoose.Schema(
    {
        user: String,
        name: String,
        text: String,
    },
    { timestamps: true }
);

const Message = mongoose.model(messageCollection, messageSchema);

export default Message;
