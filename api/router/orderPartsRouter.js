const express = require('express');

const router = express.Router();
const OrderPartsController = require('../controllers/OrderPartsController');

router.post('/order-parts', OrderPartsController.createOrderPart);
router.get('/order-parts', OrderPartsController.getOrderParts);
router.get('/order-parts/:id', OrderPartsController.getOrderPart);
router.put('/order-parts', OrderPartsController.updateOrder);
router.delete('/order-parts/:id', OrderPartsController.deleteOrderPart);

module.exports = router;
