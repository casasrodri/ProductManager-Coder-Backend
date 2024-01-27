import mongoose from 'mongoose';
import config from '../../config/config.js';
import logger from '../../utils/logger.js';

export const connectMongo = (mode = '') => {
    if (mode === 'test' || config.environment === 'testing') {
        mongoose.connect(config.mongoUriTest, {});

        if (mode === '') logger.info(`⚠️  Connection to TEST MongoDB established successfully.`);
    } else {
        mongoose.connect(config.mongoUri, {});
        logger.info(`Ⓜ️  Connection to MongoDB established successfully.`);
    }
}

export default class MongoSingleton {
    static #instance;

    constructor() {
        connectMongo();
    }

    static getInstance() {
        if (!MongoSingleton.#instance) {
            MongoSingleton.#instance = new MongoSingleton();
        }
        return MongoSingleton.#instance;
    }
}
