import { expect, api } from './requester.js';
import { v4 } from 'uuid';

describe('Sessions Endpoints', () => {

    const mockUser = {
        first_name: 'Rodri',
        last_name: 'Casas',
        email: `${v4()}@testing.com`,
        password: '2307',
    }

    describe('POST /signup', () => {
        let response;

        before(async () => {
            response = await api.post('/api/sessions/signup').send(mockUser);
        });

        it('should return 201', () => {
            expect(response.status).to.equal(201);
        });

        it('should return the created user', () => {
            const user = response.body.data
            expect(user).to.have.property('email', mockUser.email);
        });

    });

    describe('POST /login', () => {

        let cookies;
        let jwtCookie;
        let response;

        before(async () => {
            response = await api.post('/api/sessions/login').send(mockUser);
            cookies = response.headers['set-cookie'];

            const regex = /jwt=\w*.\w*.[\w,-]*;/

            for (let cookie of cookies) {
                if (regex.test(cookie)) {
                    jwtCookie = cookie;
                }
            }
        });

        it('should return 200', () => {
            expect(response.status).to.equal(200);
        });

        it('should return the logged user', () => {
            const user = response.body.data
            expect(user).to.have.property('email', mockUser.email);
        });

        it('should return the cookie', () => {
            expect(cookies).to.be.an('array');
        });

        it('should return the jwt token', () => {
            expect(jwtCookie).to.be.a('string');
        });

        it('should return an HttpOnly cookie', () => {
            const regex = /jwt=.*; HttpOnly/
            expect(regex.test(jwtCookie)).to.be.true;
        });
    });

    describe('POST /logout', async () => {

        let cookies;
        let jwtCookie;
        let response;

        before(async () => {
            response = await api.post('/api/sessions/login').send(mockUser);
            cookies = response.headers['set-cookie'];

            const regex = /jwt=\w*.\w*.[\w,-]*;/

            for (let cookie of cookies) {
                if (regex.test(cookie)) {
                    jwtCookie = cookie;
                }
            }

            response = await api.post('/api/sessions/logout').set('Cookie', jwtCookie);
            cookies = response.headers['set-cookie'];
            jwtCookie = cookies[0];
        });

        it('should return 200', () => {
            expect(response.status).to.equal(200);
        });

        it('should return the cookie', () => {
            expect(cookies).to.be.an('array');
        });

        it('should return the empty jwt cookie', () => {
            const regex = /jwt=;.*Max-Age=0;.*/
            expect(regex.test(jwtCookie)).to.be.true;
        });
    });
})

