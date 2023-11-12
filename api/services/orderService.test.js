const OrderService = require('./orderService');
const {describe, it, expect} = require("@jest/globals");

const client = require('../configs/database');

jest.mock('../configs/database');

describe('Order Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('Get all Orders', () => {

        it('should fetch all orders from the database', async () => {
            const mockRows = [
                {id: 1, order_date: '2023-11-11', status: 'completed', user_id: 123},
                {id: 2, order_date: '2023-11-12', status: 'pending', user_id: 456},
            ];

            const queryMock = jest.spyOn(client, 'query');
            queryMock.mockResolvedValueOnce({rows: mockRows});

            const result = await OrderService.getAllOrders();

            expect(queryMock).toHaveBeenCalledWith('SELECT * FROM orders ORDER BY id ASC');
            expect(result).toEqual(mockRows);
        });
    });

    describe('createOrder', () => {
        it('should create a new order successfully', async () => {
            const mockUser = {id: 123, name: 'John Doe'};
            const mockOrder = {id: 1, order_date: '2023-11-11', status: 'completed', user_id: 123};

            const mockExistingUserQuery = jest.spyOn(client, 'query');
            mockExistingUserQuery.mockResolvedValueOnce({rows: [mockUser]});

            const mockInsertOrderQuery = jest.spyOn(client, 'query');
            mockInsertOrderQuery.mockResolvedValueOnce({rows: [mockOrder]});

            const result = await OrderService.createOrder('2023-11-11', 'completed', 123);

            expect(mockExistingUserQuery).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', [123]);
            expect(mockInsertOrderQuery).toHaveBeenCalledWith(
                'INSERT INTO orders (order_date, status, user_id) VALUES ($1, $2, $3) RETURNING *',
                ['2023-11-11', 'completed', 123]
            );

            expect(result).toEqual(mockOrder);
        });

        it('should return null if the user does not exist', async () => {
            const mockExistingUserQuery = jest.spyOn(client, 'query');
            mockExistingUserQuery.mockResolvedValueOnce({rows: []});

            const result = await OrderService.createOrder('2023-11-11', 'completed', 123);

            expect(mockExistingUserQuery).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', [123]);
            expect(result).toBeNull();
        });

        it('should throw an error if an exception occurs during order creation', async () => {
            const mockInsertOrderQuery = jest.spyOn(client, 'query');
            mockInsertOrderQuery.mockRejectedValueOnce(new Error('Database error'));

            jest.spyOn(console, 'error').mockImplementation(() => {
            });

            await expect(OrderService.createOrder('2023-11-11', 'completed', 123)).rejects.toThrow('An error occurred while creating a order.');
        });
    });

    describe('getOrderById', () => {

        it('should fetch an order by ID from the database', async () => {
            const orderId = 1;
            const mockOrder = {id: orderId, order_date: '2023-11-11', status: 'completed', user_id: 123};

            const mockQuery = jest.spyOn(client, 'query');
            mockQuery.mockResolvedValueOnce({rows: [mockOrder]});

            const result = await OrderService.getOrderById(orderId);

            expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM orders WHERE id = $1', [orderId]);

            expect(result).toEqual(mockOrder);
        });

        it('should return null if no order is found with the given ID', async () => {
            const orderId = 2;

            const mockQuery = jest.spyOn(client, 'query');
            mockQuery.mockResolvedValueOnce({rows: []});

            const result = await OrderService.getOrderById(orderId);

            expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM orders WHERE id = $1', [orderId]);

            expect(result).toBeNull();
        });

        it('should throw an error if an exception occurs during order retrieval', async () => {
            const orderId = 3;

            const mockQuery = jest.spyOn(client, 'query');
            mockQuery.mockRejectedValueOnce(new Error('Database error'));

            await expect(OrderService.getOrderById(orderId)).rejects.toThrow('An error occurred while fetching the order.');
        });
    });

    describe('updateOrder', () => {
        it('should update an existing order successfully', async () => {
            const orderId = 1;
            const mockUser = {id: 123, name: 'John Doe'};
            const mockOrder = {id: orderId, order_date: '2023-11-11', status: 'completed', user_id: 123};

            const mockExistingUserQuery = jest.spyOn(client, 'query');
            mockExistingUserQuery.mockResolvedValueOnce({rows: [mockUser]});

            const mockUpdateOrderQuery = jest.spyOn(client, 'query');
            mockUpdateOrderQuery.mockResolvedValueOnce({rows: [mockOrder]});

            const result = await OrderService.updateOrder(orderId, '2023-11-11', 'completed', 123);

            expect(mockExistingUserQuery).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', [123]);

            expect(mockUpdateOrderQuery).toHaveBeenCalledWith(
                'UPDATE orders SET order_date = $1, status = $2, user_id = $3 WHERE id = $4 RETURNING *',
                ['2023-11-11', 'completed', 123, orderId]
            );

            expect(result).toEqual(mockOrder);
        });

        it('should return false if the user does not exist during update', async () => {
            const orderId = 2;

            const mockExistingUserQuery = jest.spyOn(client, 'query');
            mockExistingUserQuery.mockResolvedValueOnce({rows: []});

            const result = await OrderService.updateOrder(orderId, '2023-11-11', 'completed', 123);

            expect(mockExistingUserQuery).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', [123]);

            expect(result).toBe(false);
        });

        it('should return null if no order is found with the given ID during update', async () => {
            const orderId = 3;

            const mockExistingUserQuery = jest.spyOn(client, 'query');
            mockExistingUserQuery.mockResolvedValueOnce({rows: [{id: 123, name: 'John Doe'}]});

            const mockUpdateOrderQuery = jest.spyOn(client, 'query');
            mockUpdateOrderQuery.mockResolvedValueOnce({rows: []});

            const result = await OrderService.updateOrder(orderId, '2023-11-11', 'completed', 123);

            expect(mockExistingUserQuery).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', [123]);

            expect(mockUpdateOrderQuery).toHaveBeenCalledWith(
                'UPDATE orders SET order_date = $1, status = $2, user_id = $3 WHERE id = $4 RETURNING *',
                ['2023-11-11', 'completed', 123, orderId]
            );

            expect(result).toBeNull();
        });

        it('should throw an error if an exception occurs during order update', async () => {
            const orderId = 4;

            const mockExistingUserQuery = jest.spyOn(client, 'query');
            mockExistingUserQuery.mockResolvedValueOnce({rows: [{id: 123, name: 'John Doe'}]});

            const mockUpdateOrderQuery = jest.spyOn(client, 'query');
            mockUpdateOrderQuery.mockRejectedValueOnce(new Error('Database error'));

            jest.spyOn(console, 'error').mockImplementation(() => {
            });

            await expect(OrderService.updateOrder(orderId, '2023-11-11', 'completed', 123)).rejects.toThrow('An error occurred while updating the order.');
        });
    });


});

