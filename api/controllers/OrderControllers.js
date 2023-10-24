const client = require("../configs/database");
const OrderService = require('../services/orderService');

class OrderController {

    async getOrders(request, response) {
        try {
            const orders = await OrderService.getAllOrders();
            response.status(200).json(orders);
        } catch (error) {
            console.error("Error fetching orders:", error);
            response.status(500).json({ error: "An error occurred while fetching orders." });
        }
    }

    async createOrder(request, response) {
        try {
            const { order_date, status, user_id } = request.body;

            if (!order_date || !status || !user_id || typeof order_date !== 'string' || typeof status !== 'string' || typeof user_id !== 'number') {
                return response.status(400).json({ error: 'Invalid or missing data in the request' });
            }
            const newOrder = await OrderService.createOrder(order_date, status, user_id);
            response.status(201).json({ message: 'Order created successfully', order: newOrder });
        } catch (error) {
            console.error('Error creating model:', error);
            response.status(500).json({ error: 'An error occurred while creating order.' });
        }
    }

    async getOrder(request, response) {
        const orderId = request.params.id;
        try {
            const order = await OrderService.getOrderById(orderId);
            if (order === null) {
                response.status(404).json({ error: "Order not found." });
            } else {
                response.status(200).json(order);
            }
        } catch (error) {
            console.error("Error fetching order:", error);
            response.status(500).json({ error: "An error occurred while fetching the order." });
        }
    }

    async updateOrder(request, response) {
        const orderData = request.body;
        const { id, order_date, status, user_id } = orderData;
        if (!id) {
            return response.status(400).json({ message: 'ID not specified' });
        }

        try {
            const updatedOrder = await OrderService.updateOrder(id, order_date, status, user_id);
            if (updatedOrder === null) {
                return response.status(404).json({ error: 'Order not found' });
            }
            return response.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
        } catch (error) {
            return response.status(500).json({ error: 'An error occurred while updating the order' });
        }
    }

    async deleteOrder(request, response) {
        const orderId = request.params.id

        try {
            const deletedOrder = await OrderService.deleteOrder(orderId);

            if (deletedOrder === null) {
                return response.status(404).json({ error: 'Model not found' });
            }
            return response.status(200).json({ message: "Order deleted successfully", order: deletedOrder });

        } catch (error) {
            console.error('Error deleting order:', error);
            response.status(500).json({ error: 'An error occurred while deleting the order' });
        }
    }

}

module.exports = new OrderController();