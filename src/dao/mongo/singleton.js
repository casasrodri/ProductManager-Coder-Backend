import mongoose from 'mongoose';
import config from '../../config/config.js';

export default class MongoSingleton {
    static #instance;

    constructor() {
        mongoose.connect(config.mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Ⓜ️  Connection to MongoDB established successfully');
    }

    static getInstance() {
        if (!MongoSingleton.#instance) {
            MongoSingleton.#instance = new MongoSingleton();
        }
        return MongoSingleton.#instance;
    }
}
