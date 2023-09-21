import mongoose from 'mongoose';

const cartCollection = 'carts';
const cartSchema = new mongoose.Schema({
    products: [
        {
            product: String, // TODO: Hacer que este referencie al modelo de products.
            quantity: Number,
        },
    ],
});

const Cart = mongoose.model(cartCollection, cartSchema);

export default Cart;
