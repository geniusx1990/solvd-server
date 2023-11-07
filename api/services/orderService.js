const client = require('../configs/database');

class OrderService {
    async getAllOrders() {
        try {
            const queryResult = await client.query('SELECT * FROM orders ORDER BY id ASC');
            return queryResult.rows;
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw new Error('An error occurred while fetching orders.');
        }
    }

    async createOrder(order_date, status, user_id) {
        try {
            const existingUser = await client.query(
                'SELECT * FROM users WHERE id = $1',
                [user_id]
            );

            if (existingUser.rows.length === 0) {
                return null;
            }

            const queryResult = await client.query(
                'INSERT INTO orders (order_date, status, user_id) VALUES ($1, $2, $3) RETURNING *',
                [order_date, status, user_id]
            );

            return queryResult.rows[0];
        } catch (error) {
            console.error('Error creating order:', error);
            throw new Error('An error occurred while creating a order.');
        }
    }

    async getOrderById(orderId) {
        try {
            const queryResult = await client.query('SELECT * FROM orders WHERE id = $1', [orderId]);
            if (queryResult.rows.length === 0) {
                return null;
            }

            return queryResult.rows[0];
        } catch (error) {
            console.error("Error fetching order:", error);
            throw new Error('An error occurred while fetching the order.');


        }
    }

    async updateOrder(id, order_date, status, user_id) {
        try {
            const existingUser = await client.query(
                'SELECT * FROM users WHERE id = $1',
                [user_id]
            );

            if (existingUser.rows.length === 0) {
                return false;
            }

            const queryResult = await client.query('UPDATE orders SET order_date = $1, status = $2, user_id = $3 WHERE id = $4 RETURNING *', [order_date, status, user_id, id]);

            if (queryResult.rows.length === 0) {
                return null;
            }

            return queryResult.rows[0];
        } catch (error) {
            console.error('Error updating order:', error);
            throw new Error('An error occurred while updating the order.');
        }
    }

    async deleteOrder(orderId) {
        try {
            const queryResult = await client.query('DELETE FROM orders WHERE id = $1 RETURNING *', [orderId]);

            if (queryResult.rows.length === 0) {
                return null;
            }

            return queryResult.rows[0];
        } catch (error) {
            console.error('Error deleting order:', error);
            throw new Error('An error occurred while deleting the order');
        }
    }


    async getOrderPartsSummary(orderId) {
        try {
            const result = await client.query(`
            SELECT
              SUM(p.price) AS total_price,
              SUM(p.repair_cost) AS total_repair_cost,
              SUM(EXTRACT(EPOCH FROM p.repair_time)) AS total_repair_time
            FROM
              order_parts op
              INNER JOIN parts p ON op.part_id = p.id
            WHERE
              op.order_id = $1;
          `, [orderId]);

            return result.rows[0];
        } catch (error) {
            console.error('Error fetching order parts summary:', error);
            throw new Error('An error occurred while fetching the order parts summary.');
        }
    }


}
module.exports = new OrderService();
