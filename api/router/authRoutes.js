const express = require('express');
const authRouter = express.Router();
const AuthController = require('../controllers/AuthController');

authRouter.post('/auth/registration', AuthController.registration);
authRouter.post('/auth/login', AuthController.login);

module.exports = authRouter;