const express = require('express');
const v1Router = express.Router();

const userRouter = require('./userRouter');
const markRouter = require('./markRouter');
const vehicleRouter = require('./vehicleRouter');
const partRouter = require('./partRouter');
const orderRouter = require('./orderRouter');
const orderPartsRouter = require('./orderPartsRouter');
const authRouter = require('./authRoutes');

v1Router.use('/v1', userRouter);
v1Router.use('/v1', markRouter);
v1Router.use('/v1', vehicleRouter);
v1Router.use('/v1', partRouter);
v1Router.use('/v1', orderRouter);
v1Router.use('/v1', orderPartsRouter);
v1Router.use('/v1', authRouter);

module.exports = v1Router;