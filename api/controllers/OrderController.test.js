const httpMocks = require('node-mocks-http');
jest.mock('../services/orderService');

const OrderService = require('../services/orderService');
const OrderController = require('./OrderControllers');


const mockFetchOrders = jest.spyOn(OrderService, 'getAllOrders');
const mockSaveOrder = jest.spyOn(OrderService, 'createOrder');
const mockGetOrder = jest.spyOn(OrderService, 'getOrderById');
const mockOrderSummary = jest.spyOn(OrderService, 'getOrderPartsSummary');
const mockUpdateOrder = jest.spyOn(OrderService, 'updateOrder');


const mockOrderObject = {
    order_date: '2023-11-06', status: 'in progress', user_id: 15
};


const mockOrdersArray = [
    {
        order_date: '2023-11-06', status: 'in progress', user_id: 15
    },
    {
        order_date: '2023-10-06', status: 'confirmed', user_id: 10
    }
]

const mockOrderById = {

    "id": 3,
    "order_date": "2023-11-05",
    "status": "in progress",
    "user_id": 15,
}

const mockPartSummary = {
    "total_price": "$46.00",
    "total_repair_cost": "$20.00",
    "total_repair_time": "7200.000000"
}


describe('Order controller - unit tests', () => {
    describe('get all orders', () => {
        it('should get order list', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();
            const mockOrdersList = jest.fn(async () => {
                return {orders: mockOrdersArray};
            });
            mockFetchOrders.mockImplementation(mockOrdersList);
            await OrderController.getOrders(request, response);
            expect(mockFetchOrders).toHaveBeenCalledTimes(1);
            expect(response.statusCode).toEqual(200);
            expect(response._isEndCalled()).toBeTruthy();
            expect(response._getJSONData().orders.length).toEqual(2);
        });


        it('should handle error and return 500 status', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();
            const mockError = new Error('An error occurred');
            const mockGetAllOrders = jest.fn(async () => {
                throw mockError;
            });
            OrderService.getAllOrders = mockGetAllOrders;

            const consoleErrorSpy = jest.spyOn(console, 'error');
            consoleErrorSpy.mockImplementation(() => {
            });

            await OrderController.getOrders(request, response);

            expect(mockGetAllOrders).toHaveBeenCalledTimes(1);
            expect(response.statusCode).toEqual(500);
            expect(response._isEndCalled()).toBeTruthy();
            expect(response._getJSONData()).toEqual({error: 'An error occurred while fetching orders.'});
            expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching orders:', mockError);

            consoleErrorSpy.mockRestore();
        });
    });

    describe('create order', () => {

        it('should create an order', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();
            request.body = {
                order_date: '2023-11-06', status: 'in progress', user_id: 15
            };

            const mockOrder = jest.fn(async () => {
                return mockOrderObject;
            });

            mockSaveOrder.mockImplementation(mockOrder);
            await OrderController.createOrder(request, response);

            expect(mockSaveOrder).toHaveBeenCalledTimes(1);
            expect(response.statusCode).toEqual(201);
            expect(response._isEndCalled()).toBeTruthy();

            const responseData = response._getJSONData();
            const order = responseData.order;

            const expectedOrder = {
                order_date: '2023-11-06',
                status: 'in progress',
                user_id: 15
            };

            expect(order).toEqual(expectedOrder);
            expect(responseData.message).toEqual('Order created successfully');
        });


        it('should return 400 with error message for invalid data', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();
            request.body = {};

            await OrderController.createOrder(request, response);

            expect(response.statusCode).toEqual(400);
            expect(response._isEndCalled()).toBeTruthy();

            const responseData = response._getJSONData();
            expect(responseData.error).toEqual('Invalid or missing data in the request');
        });

        it('should return 404 with error message for non-existing user', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();
            request.body = {
                order_date: '2023-11-06',
                status: 'in progress',
                user_id: 15
            };

            const mockOrder = jest.fn(async () => {
                return null;
            });
            mockSaveOrder.mockImplementation(mockOrder);

            await OrderController.createOrder(request, response);

            expect(response.statusCode).toEqual(404);
            expect(response._isEndCalled()).toBeTruthy();

            const responseData = response._getJSONData();
            expect(responseData.error).toEqual('This user does not exist.');
        });


        describe('get order', () => {
            it('should get an existing order', async () => {
                const response = httpMocks.createResponse();
                const request = httpMocks.createRequest();
                const orderId = 3;

                const mockGetOrderById = jest.fn(async () => {
                    return mockOrderById;
                });
                const mockGetOrderPartsSummary = jest.fn(async () => {
                    return mockPartSummary;
                });
                request.params.id = orderId;

                mockGetOrder.mockImplementation(mockGetOrderById);
                mockOrderSummary.mockImplementation(mockGetOrderPartsSummary);


                await OrderController.getOrder(request, response);

                expect(response.statusCode).toEqual(200);
                expect(response._isEndCalled()).toBeTruthy();

                const responseData = response._getJSONData();
                expect(responseData.id).toEqual(orderId);
            });


            it('should get an summary', async () => {
                const response = httpMocks.createResponse();
                const request = httpMocks.createRequest();
                const orderId = 3;

                const mockGetOrderById = jest.fn(async () => {
                    return mockOrderById;
                });
                const mockGetOrderPartsSummary = jest.fn(async () => {
                    return mockPartSummary;
                });
                request.params.id = orderId;

                mockGetOrder.mockImplementation(mockGetOrderById);
                mockOrderSummary.mockImplementation(mockGetOrderPartsSummary);


                await OrderController.getOrder(request, response);

                expect(response.statusCode).toEqual(200);
                expect(response._isEndCalled()).toBeTruthy();

                const responseData = response._getJSONData();
                expect(responseData.partsSummary).toEqual(mockPartSummary);
            });

            it('should return 404 for non-existing order', async () => {
                const response = httpMocks.createResponse();
                const request = httpMocks.createRequest();
                const orderId = 3;

                const mockGetOrderById = jest.fn(async () => {
                    return null;
                });

                OrderService.getOrderById = mockGetOrderById;

                request.params.id = orderId;

                await OrderController.getOrder(request, response);

                expect(response.statusCode).toEqual(404);
                expect(response._isEndCalled()).toBeTruthy();

                const responseData = response._getJSONData();
                expect(responseData.error).toEqual('Order not found.');
            });


        });

        describe('update order', () => {
            beforeEach(() => {
                mockUpdateOrder.mockClear();
            });

            it('should update an existing order', async () => {
                const response = httpMocks.createResponse();
                const request = httpMocks.createRequest();
                const orderId = 1;
                const updatedOrderData = {
                    id: orderId,
                    order_date: '2023-11-10',
                    status: 'completed',
                    user_id: 20
                };

                mockUpdateOrder.mockImplementation(async () => {
                    return updatedOrderData;
                });


                request.body = {
                    id: orderId,
                    order_date: '2023-11-10',
                    status: 'completed',
                    user_id: 20
                };

                await OrderController.updateOrder(request, response);

                expect(response.statusCode).toEqual(200);
                expect(response._isEndCalled()).toBeTruthy();

                const responseData = response._getJSONData();
                expect(responseData.message).toEqual('Order updated successfully');
                expect(responseData.order).toEqual(updatedOrderData);
            });


            it('should return 404 for non-existing order', async () => {
                const response = httpMocks.createResponse();
                const request = httpMocks.createRequest();
                const orderId = 1;
                const updatedOrderData = {
                    id: orderId,
                    order_date: '2023-11-10',
                    status: 'completed',
                    user_id: 20
                };

                mockUpdateOrder.mockImplementation(async () => {
                    return null;
                });

                const mockGetUserById = jest.fn(async () => {
                    return false;
                });


                request.body = updatedOrderData;

                await OrderController.updateOrder(request, response);
                expect(response.statusCode).toEqual(404);
                expect(response._isEndCalled()).toBeTruthy();

                const responseData = response._getJSONData();
                expect(responseData.error).toEqual('Order not found');

            });

            it('should return a 400 response when ID is not specified', async () => {
                const request = { body: {} };
                const response = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn(),
                };

                await OrderController.updateOrder(request, response);

                expect(response.status).toHaveBeenCalledWith(400);
                expect(response.json).toHaveBeenCalledWith({ message: 'ID not specified' });
            });



        });

    });


});
