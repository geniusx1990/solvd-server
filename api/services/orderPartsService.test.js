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


});
