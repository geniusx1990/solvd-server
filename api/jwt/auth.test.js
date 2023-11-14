const { createJwtToken } = require('./auth');
const {describe, it, expect} = require("@jest/globals");

describe('createJwtToken', () => {
    it('should create a JWT token with the correct header and payload', () => {

        const secret = 'SECRET_KEY_RANDOM';

        const payload = {
            sub: 1,
            name: 'Alex',
            role: 'Admin',
        };

        const token = createJwtToken(payload, secret);

        const [encodedHeader, encodedPayload, signature] = token.split('.');

        const header = JSON.parse(Buffer.from(encodedHeader, 'base64').toString());
        const decodedPayload = JSON.parse(Buffer.from(encodedPayload, 'base64').toString());

        expect(header).toEqual({ alg: 'HS256', typ: 'JWT' });
        expect(decodedPayload).toEqual(payload);

        expect(signature).toBeTruthy();
    });
});
