const OrderPartsService = require('./orderPartsService');
const {describe, it, expect} = require("@jest/globals");

const client = require('../configs/database');

jest.mock('../configs/database');

describe('OrderParts Service', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Get all OrderPartsService', () => {

        it('should fetch all OrderPartsService from the database', async () => {
            const mockQueryResult = {
                rows: [
                    {id: 1, order_id: 2, part_id: 3},
                    {id: 2, order_id: 3, part_id: 4},
                ],
            };
            client.query.mockResolvedValueOnce(mockQueryResult);

            const result = await OrderPartsService.getAllOrderParts();

            expect(result).toEqual(mockQueryResult.rows);

            expect(client.query).toHaveBeenCalledWith('SELECT * FROM order_parts ORDER BY id ASC');
        });

        it('should handle errors when fetching OrderPartsService', async () => {
            const errorMessage = 'Database error';
            client.query.mockRejectedValueOnce(new Error(errorMessage));

            jest.spyOn(console, 'error').mockImplementation(() => {
            });

            await expect(OrderPartsService.getAllOrderParts()).rejects.toThrow(
                'An error occurred while fetching order parts.'
            );

            expect(client.query).toHaveBeenCalledWith('SELECT * FROM order_parts ORDER BY id ASC');
        });

    });

    describe('addOrderPart', () => {

        it('should add a new order part if it does not exist', async () => {
            client.query.mockResolvedValueOnce({rows: []});

            client.query.mockResolvedValueOnce({rows: [{order_id: 1, part_id: 1}]});

            const result = await OrderPartsService.addOrderPart(1, 1);

            expect(result).toEqual({order_id: 1, part_id: 1});

            expect(client.query).toHaveBeenCalledWith(
                'SELECT * FROM order_parts WHERE order_id = $1 AND part_id = $2',
                [1, 1]
            );
            expect(client.query).toHaveBeenCalledWith(
                'INSERT INTO order_parts (order_id, part_id) VALUES ($1, $2) RETURNING *',
                [1, 1]
            );
        });

        it('should return null if the order part already exists', async () => {
            client.query.mockResolvedValueOnce({rows: [{order_id: 1, part_id: 1}]});

            const result = await OrderPartsService.addOrderPart(1, 1);

            expect(result).toBeNull();

            expect(client.query).toHaveBeenCalledWith(
                'SELECT * FROM order_parts WHERE order_id = $1 AND part_id = $2',
                [1, 1]
            );

            expect(client.query).not.toHaveBeenCalledWith(
                'INSERT INTO order_parts (order_id, part_id) VALUES ($1, $2) RETURNING *',
                [1, 1]
            );
        });

        it('should throw an error if there is an error during the database operation', async () => {
            client.query.mockRejectedValueOnce(new Error('Database error'));

            jest.spyOn(console, 'error').mockImplementation(() => {
            });

            await expect(OrderPartsService.addOrderPart(1, 1)).rejects.toThrow(
                'An error occurred while creating a part for order.'
            );
        });
    });

    describe('getOrderPartByID', () => {

        it('should return the order part when it exists', async () => {
            client.query.mockResolvedValueOnce({rows: [{id: 1, order_id: 1, part_id: 1}]});

            const result = await OrderPartsService.getOrderPartByID(1);

            expect(result).toEqual({id: 1, order_id: 1, part_id: 1});

            expect(client.query).toHaveBeenCalledWith(
                'SELECT * FROM order_parts WHERE id = $1',
                [1]
            );
        });

        it('should return null if the order part does not exist', async () => {
            client.query.mockResolvedValueOnce({rows: []});

            const result = await OrderPartsService.getOrderPartByID(1);

            expect(result).toBeNull();

            expect(client.query).toHaveBeenCalledWith(
                'SELECT * FROM order_parts WHERE id = $1',
                [1]
            );
        });

        it('should throw an error if there is an error during the database operation', async () => {
            client.query.mockRejectedValueOnce(new Error('Database error'));

            jest.spyOn(console, 'error').mockImplementation(() => {
            });

            await expect(OrderPartsService.getOrderPartByID(1)).rejects.toThrow(
                'An error occurred while fetching the order parts.'
            );
        });
    });

    describe('updateOrderPart', () => {

        it('should update the order part when both order and part exist', async () => {
            client.query.mockResolvedValueOnce({rows: [{id: 1}]});
            client.query.mockResolvedValueOnce({rows: [{id: 1}]});
            client.query.mockResolvedValueOnce({rows: [{id: 1, order_id: 1, part_id: 1}]});

            const result = await OrderPartsService.updateOrderPart(1, 1, 1);

            expect(result).toEqual({id: 1, order_id: 1, part_id: 1});

            expect(client.query).toHaveBeenCalledWith('SELECT * FROM parts WHERE id = $1', [1]);
            expect(client.query).toHaveBeenCalledWith('SELECT * FROM orders WHERE id = $1', [1]);
            expect(client.query).toHaveBeenCalledWith('UPDATE order_parts SET order_id = $1, part_id = $2 WHERE id = $3 RETURNING *', [1, 1, 1]);
        });

        it('should return false if the part does not exist', async () => {
            client.query.mockResolvedValueOnce({rows: []});

            const result = await OrderPartsService.updateOrderPart(1, 1, 1);

            expect(result).toBe(false);

            expect(client.query).toHaveBeenCalledWith('SELECT * FROM parts WHERE id = $1', [1]);

            expect(client.query).not.toHaveBeenCalledWith('SELECT * FROM orders WHERE id = $1', [1]);
            expect(client.query).not.toHaveBeenCalledWith('UPDATE order_parts SET order_id = $1, part_id = $2 WHERE id = $3 RETURNING *', [1, 1, 1]);
        });

        it('should return null if the update query does not return any rows', async () => {
            client.query.mockResolvedValueOnce({rows: [{id: 1}]});
            client.query.mockResolvedValueOnce({rows: [{id: 1}]});
            client.query.mockResolvedValueOnce({rows: []});

            const result = await OrderPartsService.updateOrderPart(1, 1, 1);

            expect(result).toBeNull();

            expect(client.query).toHaveBeenCalledWith('SELECT * FROM parts WHERE id = $1', [1]);
            expect(client.query).toHaveBeenCalledWith('SELECT * FROM orders WHERE id = $1', [1]);
            expect(client.query).toHaveBeenCalledWith('UPDATE order_parts SET order_id = $1, part_id = $2 WHERE id = $3 RETURNING *', [1, 1, 1]);
        });

        it('should throw an error if there is an error during the database operation', async () => {
            client.query.mockRejectedValueOnce(new Error('Database error'));

            jest.spyOn(console, 'error').mockImplementation(() => {
            });

            await expect(OrderPartsService.updateOrderPart(1, 1, 1)).rejects.toThrow(
                'An error occurred while updating the order part.'
            );
        });
    });

});
