const OrderPartsService = require('../services/orderPartsService');

class OrderPartsController {

    async getOrderParts(request, response) {
        try {
            const orderParts = await OrderPartsService.getAllOrderParts();
            response.status(200).json(orderParts);
        } catch (error) {
            console.error("Error fetching order parts:", error);
            response.status(500).json({ error: "An error occurred while fetching order parts." });
        }
    }

    async createOrderPart(request, response) {
        try {
            const { order_id, part_id } = request.body;

            if (!order_id || !part_id || typeof order_id !== 'number' || typeof part_id !== 'number') {
                return response.status(400).json({ error: 'Invalid or missing data in the request' });
            }

            const newOrderPart = await OrderPartsService.addOrderPart(order_id, part_id);
            response.status(201).json({ message: 'Order part created successfully', orderPart: newOrderPart });
        } catch (error) {
            console.error('Error creating part for order:', error);
            response.status(500).json({ error: 'An error occurred while creating a part for order.' });
        }
    }

    async getOrderPart(request, response) {
        const orderPartId = request.params.id;
        try {
            const order = await OrderPartsService.getOrderPartByID(orderPartId);
            if (order === null) {
                response.status(404).json({ error: "Order part not found." });
            } else {
                response.status(200).json(order);
            }
        } catch (error) {
            console.error("Error fetching order parts:", error);
            response.status(500).json({ error: "An error occurred while fetching the order parts." });
        }
    }

    async updateOrder(request, response) {
        const orderPartsData = request.body;
        const { id, order_id, part_id } = orderPartsData;
        if (!id) {
            return response.status(400).json({ message: 'ID not specified' });
        }

        try {
            const updatedOrderPart = await OrderPartsService.updateOrderPart(id, order_id, part_id);
            if (updatedOrderPart === null) {
                return response.status(404).json({ error: 'Order part not found' });
            }
            response.status(200).json({ message: 'Order part updated successfully', orderPart: updatedOrderPart });
        } catch (error) {
            return response.status(500).json({ error: 'An error occurred while updating the order part' });
        }
    }

    async deleteOrderPart(request, response) {
        const { order_id, part_id } = request.query; 
        try {
            const deletedOrderPart = await OrderPartsService.deleteOrderPartById(order_id, part_id );

            if (deletedOrderPart === null) {
                return response.status(404).json({ error: 'Order part not found' });
            }
            response.status(200).json({
                message: "Order part deleted successfully", part: deletedOrderPart
            });

        } catch (error) {
            console.error('Error deleting order part:', error);
            response.status(500).json({ error: 'An error occurred while deleting the order part' });
        }
    }

}

module.exports = new OrderPartsController();