const express = require('express');
const authRouter = express.Router();
const AuthController = require('../controllers/authController');

authRouter.post('/registration', AuthController.registration);
authRouter.post('/login', AuthController.login);

module.exports = authRouter;