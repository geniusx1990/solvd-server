const {describe, it, expect} = require("@jest/globals");
const httpMocks = require('node-mocks-http');

jest.mock('../services/orderPartsService');

const OrderPartsService = require('../services/orderPartsService');
const OrderPartsController = require('./OrderPartsController');


const mockFetchOrderParts = jest.spyOn(OrderPartsService, 'getAllOrderParts');
const mockSaveOrderPart = jest.spyOn(OrderPartsService, 'addOrderPart');
const mockGetOrderPartF = jest.spyOn(OrderPartsService, 'getOrderPartByID');
const mockUpdateOrderPartF = jest.spyOn(OrderPartsService, 'updateOrderPart');
const mockDeleteOrderPart = jest.spyOn(OrderPartsService, 'deleteOrderPartById');

const mockOrderParts = [
    {
        "id": 1,
        "order_id": 1,
        "part_id": 2
    },
    {
        "id": 2,
        "order_id": 1,
        "part_id": 2
    },
    {
        "id": 3,
        "order_id": 3,
        "part_id": 3
    }
];

describe('OrderParstController - unit tests', () => {

    describe('get orderParts', () => {
        it('should return a 200 response with a list of order parts when successful', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();

            const mockOrderPartsList = jest.fn(async () => {
                return mockOrderParts;
            });

            mockFetchOrderParts.mockImplementation(mockOrderPartsList);
            await OrderPartsController.getOrderParts(request, response);
            expect(mockFetchOrderParts).toHaveBeenCalledTimes(1);
            expect(response.statusCode).toEqual(200);
            expect(response._isEndCalled()).toBeTruthy();
            expect(response._getJSONData().length).toEqual(3);
        });


        it('should handle error and return 500 status', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();
            const mockError = new Error('An error occurred');
            const mockGetAllVehicles = jest.fn(async () => {
                throw mockError;
            });
            mockFetchOrderParts.mockImplementation(mockGetAllVehicles);

            const consoleErrorSpy = jest.spyOn(console, 'error');
            consoleErrorSpy.mockImplementation(() => {
            });

            await OrderPartsController.getOrderParts(request, response);

            expect(mockGetAllVehicles).toHaveBeenCalledTimes(1);
            expect(response.statusCode).toEqual(500);
            expect(response._isEndCalled()).toBeTruthy();
            expect(response._getJSONData()).toEqual({error: 'An error occurred while fetching order parts.'});
            expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching order parts:', mockError);

            consoleErrorSpy.mockRestore();
        });
    });


    describe('create orderParts', () => {

        it('should create orderPart and return status 201', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();

            const mockVehicleData = {
                id: 1,
                order_id: 3,
                part_id: 3
            };

            const mockCreateVehicle = jest.fn(async () => {
                return mockVehicleData;
            });

            mockSaveOrderPart.mockImplementation(mockCreateVehicle);

            request.body = {
                order_id: 3,
                part_id: 3
            };

            await OrderPartsController.createOrderPart(request, response);

            expect(response.statusCode).toEqual(201);
            expect(response._isEndCalled()).toBeTruthy();

            const responseData = response._getJSONData();
            expect(responseData.message).toEqual('Order part created successfully');
            expect(responseData.orderPart).toEqual(mockVehicleData);
        });

        it('should return code 400 when trying to create a part for an order with invalid data', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();

            request.body = {
                order_id: 'invalid',
                part_id: 'invalid',
            };

            await OrderPartsController.createOrderPart(request, response);

            expect(response.statusCode).toEqual(400);
            expect(response._isEndCalled()).toBeTruthy();

            const responseData = response._getJSONData();
            expect(responseData.error).toEqual('Invalid or missing data in the request');
        });


        it('should return code 409 when trying to create a part for an order that already exists in the order', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();

            const mockCreateOrderPart = jest.fn(async () => {
                return null;
            });

            mockSaveOrderPart.mockImplementation(mockCreateOrderPart);

            request.body = {
                order_id: 1,
                part_id: 2,
            };
            await OrderPartsController.createOrderPart(request, response);

            expect(response.statusCode).toEqual(409);
            expect(response._isEndCalled()).toBeTruthy();

            const responseData = response._getJSONData();
            expect(responseData.error).toEqual('This part already exists in this order');
        });

        it('should return code 500 on internal server error', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();

            const errorMessage = 'Internal server error';
            const mockError = new Error(errorMessage);

            const mockCreateOrderPart = jest.fn(async () => {
                throw mockError;
            });

            mockSaveOrderPart.mockImplementation(mockCreateOrderPart);

            request.body = {
                order_id: 1,
                part_id: 2,
            };

            const consoleErrorSpy = jest.spyOn(console, 'error');
            consoleErrorSpy.mockImplementation(() => {
            });


            await OrderPartsController.createOrderPart(request, response);

            expect(response.statusCode).toEqual(500);
            expect(response._isEndCalled()).toBeTruthy();

            const responseData = response._getJSONData();
            expect(responseData.error).toEqual('An error occurred while creating a part for order.');
        });


    });

    describe('getOrderPart', () => {
        it('should return code 200 and part of the order on successful request', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();

            const mockOrderPartData = {
                id: 1,
                order_id: 1,
                part_id: 2,
            };

            const mockGetOrderPart = jest.fn(async () => {
                return mockOrderPartData;
            });

            mockGetOrderPartF.mockImplementation(mockGetOrderPart);

            request.params.id = '1';

            await OrderPartsController.getOrderPart(request, response);

            expect(response.statusCode).toEqual(200);
            expect(response._isEndCalled()).toBeTruthy();

            const responseData = response._getJSONData();
            expect(responseData).toEqual(mockOrderPartData);
        });

        it('should return code 404 when trying to receive a non-existent part of the order', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();

            const mockGetOrderPart = jest.fn(async () => {
                return null;
            });

            mockGetOrderPartF.mockImplementation(mockGetOrderPart);

            request.params.id = '1';

            await OrderPartsController.getOrderPart(request, response);

            expect(response.statusCode).toEqual(404);
            expect(response._isEndCalled()).toBeTruthy();

            const responseData = response._getJSONData();
            expect(responseData.error).toEqual('Order part not found.');
        });

        it('should return code 500 on internal server error', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();

            const errorMessage = 'Internal server error';
            const mockError = new Error(errorMessage);

            const mockGetOrderPart = jest.fn(async () => {
                throw mockError;
            });

            mockGetOrderPartF.mockImplementation(mockGetOrderPart);

            request.params.id = '1';

            const consoleErrorSpy = jest.spyOn(console, 'error');
            consoleErrorSpy.mockImplementation(() => {
            });

            await OrderPartsController.getOrderPart(request, response);

            expect(response.statusCode).toEqual(500);
            expect(response._isEndCalled()).toBeTruthy();

            const responseData = response._getJSONData();
            expect(responseData.error).toEqual('An error occurred while fetching the order parts.');
        });
    });

    describe('updateOrder', () => {
        it('should return code 200 and the updated part of the order upon successful update', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();

            const mockUpdatedOrderPartData = {
                id: 1,
                order_id: 1,
                part_id: 2,
            };

            const mockUpdateOrderPart = jest.fn(async () => {
                return mockUpdatedOrderPartData;
            });

            mockUpdateOrderPartF.mockImplementation(mockUpdateOrderPart);

            request.body = {
                id: 1,
                order_id: 1,
                part_id: 2,
            };

            await OrderPartsController.updateOrder(request, response);

            expect(response.statusCode).toEqual(200);
            expect(response._isEndCalled()).toBeTruthy();

            const responseData = response._getJSONData();
            expect(responseData).toEqual({
                message: 'Order part updated successfully',
                orderPart: mockUpdatedOrderPartData,
            });
        });

        it('should return code 404 when trying to update part of an order for a non-existent order', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();

            const mockUpdateOrderPart = jest.fn(async () => {
                return true;
            });

            mockUpdateOrderPartF.mockImplementation(mockUpdateOrderPart);

            request.body = {
                id: '1',
                order_id: '1',
                part_id: '2',
            };

            await OrderPartsController.updateOrder(request, response);

            expect(response.statusCode).toEqual(404);
            expect(response._isEndCalled()).toBeTruthy();

            const responseData = response._getJSONData();
            expect(responseData.error).toEqual("This order doesn't exist.");
        });


        it('should return code 404 when trying to update a non-existent order part for an existing order', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();

            const mockUpdateOrderPart = jest.fn(async () => {
                return null;
            });

            mockUpdateOrderPartF.mockImplementation(mockUpdateOrderPart);

            request.body = {
                id: '1',
                order_id: '1',
                part_id: '2',
            };

            await OrderPartsController.updateOrder(request, response);

            expect(response.statusCode).toEqual(404);
            expect(response._isEndCalled()).toBeTruthy();

            const responseData = response._getJSONData();
            expect(responseData.error).toEqual('Order part not found');
        });


        it('should return code 500 on internal server error', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();

            const errorMessage = 'Internal server error';
            const mockError = new Error(errorMessage);

            const mockUpdateOrderPart = jest.fn(async () => {
                throw mockError;
            });

            mockUpdateOrderPartF.mockImplementation(mockUpdateOrderPart);

            request.body = {
                id: '1',
                order_id: '1',
                part_id: '2',
            };

            await OrderPartsController.updateOrder(request, response);

            expect(response.statusCode).toEqual(500);
            expect(response._isEndCalled()).toBeTruthy();

            const responseData = response._getJSONData();
            expect(responseData.error).toEqual('An error occurred while updating the order part');
        });

    });


});



