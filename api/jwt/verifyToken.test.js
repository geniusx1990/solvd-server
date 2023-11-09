const { verifyJwtToken } = require('./verifyToken');
const { createJwtToken } = require('./auth');
describe('verifyJwtToken', () => {
    it('should verify a valid JWT token', () => {
        const secret = 'yourSecretKey';

        const payload = {
            sub: 2,
            name: 'Alex',
            role: 'user',
            exp: Math.floor(Date.now() / 1000) + 3600,
            iat: Math.floor(Date.now() / 1000) - 3600,
        };

        const token = createJwtToken(payload, secret);

        const verifiedPayload = verifyJwtToken(token, secret);

        expect(verifiedPayload).toEqual(payload);
    });

    it('should throw an error for an invalid signature', () => {
        const secret = 'yourSecretKey';

        const payload = {
            sub: 2,
            name: 'Alex',
            role: 'user',
        };

        const tokenWithInvalidSignature = createJwtToken(payload, 'invalidSecret');

        expect(() => verifyJwtToken(tokenWithInvalidSignature, secret)).toThrow('Invalid token signature');
    });

    it('should throw an error for an expired token', () => {
        const secret = 'yourSecretKey';

        const payload = {
            sub: 2,
            name: 'Alex',
            role: 'user',
            exp: Math.floor(Date.now() / 1000) - 3600,
        };

        const expiredToken = createJwtToken(payload, secret);

        expect(() => verifyJwtToken(expiredToken, secret)).toThrow('Token has expired');
    });

    it('should throw an error for a token that is not yet valid', () => {
        const secret = 'yourSecretKey';

        const payload = {
            sub: 2,
            name: 'Alex',
            role: 'user',
            iat: Math.floor(Date.now() / 1000) + 3600,
        };

        const tokenNotYetValid = createJwtToken(payload, secret);

        expect(() => verifyJwtToken(tokenNotYetValid, secret)).toThrow('Token is not yet valid');
    });
});
