const express = require('express');

const router = express.Router();
const OrderController = require('../controllers/OrderControllers');

router.post('/orders', OrderController.createOrder);
router.get('/orders', OrderController.getOrders);
router.get('/orders/:id', OrderController.getOrder);
router.put('/orders', OrderController.updateOrder);
router.delete('/orders/:id', OrderController.deleteOrder);

module.exports = router;
