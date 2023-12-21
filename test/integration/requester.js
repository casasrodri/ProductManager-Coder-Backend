import chai from 'chai';
import supertest from 'supertest';
import config from '../../src/config/config.js';

const expect = chai.expect;
const api = supertest(`http://localhost:${config.port}`);

export { expect, api };
