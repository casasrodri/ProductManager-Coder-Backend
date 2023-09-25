import mongoose from 'mongoose';

const cartCollection = 'carts';
const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Types.ObjectId,
                ref: 'products',
            },
            quantity: Number,
        },
    ],
});

const Cart = mongoose.model(cartCollection, cartSchema);

export default Cart;
