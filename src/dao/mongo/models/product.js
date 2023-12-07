import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import config from '../../../config/config.js'

const productCollection = 'products';
const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnails: { type: [String], default: [] },
    status: { type: Boolean, default: true },
    owner: {
        default: config.userAdmin.email,
        type: String,
        ref: 'users',
    },
});

productSchema.plugin(mongoosePaginate);
const Product = mongoose.model(productCollection, productSchema);

export default Product;
