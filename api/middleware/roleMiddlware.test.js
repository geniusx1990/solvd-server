const request = require('supertest');
const express = require('express');
const roleMiddleware = require('./roleMiddlware');
const { generateAccessToken } = require('../jwt/generateAccessToken')
const app = express();

app.use(roleMiddleware('Admin'));

app.get('/api/v1/users', (req, res) => {
    res.sendStatus(200);
});
const accessToken = generateAccessToken(22, 'Admin');
const invalidToken = generateAccessToken(22, 'User');

describe('Role Middleware', () => {
    it('should reach the final path with the right role', async () => {
        const response = await request(app)
            .get('/api/v1/users')
            .set('Authorization', `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
    });

    it('should not reach the final path with the wrong role', async () => {
        const response = await request(app)
            .get('/api/v1/users')
            .set('Authorization', `Bearer ${invalidToken}`);

        expect(response.status).toBe(403);
    });
});
