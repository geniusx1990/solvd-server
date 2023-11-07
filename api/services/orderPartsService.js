const client = require('../configs/database');

class OrderPartsService {
    async getAllOrderParts() {
        try {
            const queryResult = await client.query('SELECT * FROM order_parts ORDER BY id ASC');
            return queryResult.rows;
        } catch (error) {
            console.error('Error fetching order parts:', error);
            throw new Error('An error occurred while fetching order parts.');
        }
    }

    async addOrderPart(order_id, part_id) {
        try {
            const existingOrderPart = await client.query(
                'SELECT * FROM order_parts WHERE order_id = $1 AND part_id = $2',
                [order_id, part_id]
            );

            if (existingOrderPart.rows.length > 0) {
                return null;
            }


            const queryResult = await client.query(
                'INSERT INTO order_parts (order_id, part_id) VALUES ($1, $2) RETURNING *',
                [order_id, part_id]
            );

            return queryResult.rows[0];
        } catch (error) {
            console.error('Error creating part for order:', error);
            throw new Error('An error occurred while creating a part for order.');
        }
    }

    async getOrderPartByID(orderPartId) {
        try {
            const queryResult = await client.query('SELECT * FROM order_parts WHERE id = $1', [orderPartId]);
            if (queryResult.rows.length === 0) {
                return null;
            }

            return queryResult.rows[0];
        } catch (error) {
            console.error("Error fetching order parts:", error);
            throw new Error('An error occurred while fetching the order parts.');


        }
    }

    async updateOrderPart(id, order_id, part_id) {
        try {

            const existingPart = await client.query(
                'SELECT * FROM parts WHERE id = $1',
                [part_id]
            );

            if (existingPart.rows.length === 0) {
                return false;
            }

            const existingOrder = await client.query(
                'SELECT * FROM orders WHERE id = $1',
                [order_id]
            );

            if (existingOrder.rows.length === 0) {
                return true;
            }


            const queryResult = await client.query('UPDATE order_parts SET order_id = $1, part_id = $2 WHERE id = $3 RETURNING *', [order_id, part_id, id]);

            if (queryResult.rows.length === 0) {
                return null;
            }

            return queryResult.rows[0];
        } catch (error) {
            console.error('Error updating order part:', error);
            throw new Error('An error occurred while updating the order part.');
        }
    }

    async deleteOrderPartById(order_id, part_id) {
        try {
            const queryResult = await client.query('DELETE FROM order_parts WHERE order_id = $1 AND part_id = $2 RETURNING *', [order_id, part_id]);

            if (queryResult.rows.length === 0) {
                return null;
            }

            return queryResult.rows[0];
        } catch (error) {
            console.error('Error deleting order part:', error);
            throw new Error('An error occurred while deleting the order part');
        }
    }




}
module.exports = new OrderPartsService();
