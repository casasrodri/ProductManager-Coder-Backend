import { expect } from 'chai';
import supertest from 'supertest';
import config from '../../src/config/config.js';

const api = supertest(`http://localhost:${config.port}`);

const checkEnvironment = async () => {
    const response = await api.get('/env').send()

    if (response.body.env !== 'testing') {
        throw new Error('You must set ENVIROMENT variable to testing');
    }
}

checkEnvironment();

export { expect, api };
