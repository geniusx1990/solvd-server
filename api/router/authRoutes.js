const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/authController');

authRouter.post('/auth/registration', authController.registration);
authRouter.post('/auth/login', authController.login);

module.exports = authRouter;