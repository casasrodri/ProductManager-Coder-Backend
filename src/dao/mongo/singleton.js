import mongoose from 'mongoose';
import config from '../../config/config.js';
import logger from '../../utils/logger.js';

export default class MongoSingleton {
    static #instance;

    constructor() {
        mongoose.connect(config.mongoUri, {});
        logger.info('Ⓜ️  Connection to MongoDB established successfully');
    }

    static getInstance() {
        if (!MongoSingleton.#instance) {
            MongoSingleton.#instance = new MongoSingleton();
        }
        return MongoSingleton.#instance;
    }
}
