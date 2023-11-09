const httpMocks = require('node-mocks-http');
jest.mock('../services/vehicleService');

const VehicleService = require('../services/vehicleService');
const VehicleController = require('./VehicleController');


const mockFetchVehicles = jest.spyOn(VehicleService, 'getAllVehicles');
const mockSaveVehicle = jest.spyOn(VehicleService, 'createVehicle');
const mockGetVehicle = jest.spyOn(VehicleService, 'getVehicleById');
const mockUpdateVehicleF = jest.spyOn(VehicleService, 'updateVehicle');
const mockDeleteVehicle = jest.spyOn(VehicleService, 'deleteVehicleById');

const mockVehicles = [
    {id: 1, mark_id: '3', vehicle_year: '2002'},
    {id: 2, mark_id: '2', vehicle_year: '2012'},
];
describe('Vehicle controller - unit tests', () => {

    describe('get vehicles', () => {
        it('should return a 200 response with a list of vehicles when successful', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();

            const mockOrdersList = jest.fn(async () => {
                return mockVehicles;
            });

            mockFetchVehicles.mockImplementation(mockOrdersList);
            await VehicleController.getVehicles(request, response);
            expect(mockFetchVehicles).toHaveBeenCalledTimes(1);
            expect(response.statusCode).toEqual(200);
            expect(response._isEndCalled()).toBeTruthy();
            expect(response._getJSONData().length).toEqual(2);
        });


        it('should handle error and return 500 status', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();
            const mockError = new Error('An error occurred');
            const mockGetAllVehicles = jest.fn(async () => {
                throw mockError;
            });
            VehicleService.getAllVehicles = mockGetAllVehicles;

            const consoleErrorSpy = jest.spyOn(console, 'error');
            consoleErrorSpy.mockImplementation(() => {
            });

            await VehicleController.getVehicles(request, response);

            expect(mockGetAllVehicles).toHaveBeenCalledTimes(1);
            expect(response.statusCode).toEqual(500);
            expect(response._isEndCalled()).toBeTruthy();
            expect(response._getJSONData()).toEqual({error: 'An error occurred while fetching vehicles.'});
            expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching vehicles:', mockError);

            consoleErrorSpy.mockRestore();
        });
    });


    describe('get vehicles', () => {
        it('should create vehicle and return status 201', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();

            const mockVehicleData = {
                id: 1,
                mark_id: 3,
                vehicle_year: 2022,
            };

            const mockCreateVehicle = jest.fn(async () => {
                return mockVehicleData;
            });

            mockSaveVehicle.mockImplementation(mockCreateVehicle);

            request.body = {
                mark_id: 3,
                vehicle_year: 2022,
            };

            await VehicleController.createVehicle(request, response);

            expect(response.statusCode).toEqual(201);
            expect(response._isEndCalled()).toBeTruthy();

            const responseData = response._getJSONData();
            expect(responseData.message).toEqual('Vehicle created successfully');
            expect(responseData.vehicle).toEqual(mockVehicleData);
        });


        it('should return 400 with error message for invalid data', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();

            request.body = {
                mark_id: 'invalid',
                vehicle_year: 'invalid',
            };

            await VehicleController.createVehicle(request, response);

            expect(response.statusCode).toEqual(400);
            expect(response._isEndCalled()).toBeTruthy();

            const responseData = response._getJSONData();
            expect(responseData.error).toEqual('Invalid or missing data in the request');
        });


        it('should return status 409 with error that this vehicle exist', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();

            const mockCreateVehicle = jest.fn(async () => {
                return null;
            });

            jest.spyOn(VehicleService, 'createVehicle').mockImplementation(mockCreateVehicle);

            request.body = {
                mark_id: 3,
                vehicle_year: 2022,
            };

            await VehicleController.createVehicle(request, response);

            expect(response.statusCode).toEqual(409);
            expect(response._isEndCalled()).toBeTruthy();

            const responseData = response._getJSONData();
            expect(responseData.error).toEqual('Vehicle with the same mark and vehicle_year already exists');
        });


        it('should handle error and return 500 status', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();

            const mockError = new Error('Error creating vehicle');

            const mockCreateVehicle = jest.fn(async () => {
                throw mockError;
            });

            mockSaveVehicle.mockImplementation(mockCreateVehicle);

            const consoleErrorSpy = jest.spyOn(console, 'error');
            consoleErrorSpy.mockImplementation(() => {
            });


            request.body = {
                mark_id: 3,
                vehicle_year: 2022,
            };

            await VehicleController.createVehicle(request, response);
            expect(mockCreateVehicle).toHaveBeenCalledTimes(1);

            expect(response.statusCode).toEqual(500);
            expect(response._isEndCalled()).toBeTruthy();

            expect(response._getJSONData()).toEqual({error: 'An error occurred while creating a vehicle.'});

        });

        describe('get vehicle by id', () => {
            it('should return status 200 and vehicle data', async () => {
                const response = httpMocks.createResponse();
                const request = httpMocks.createRequest();

                const mockVehicleData = {
                    id: 1,
                    mark_id: 3,
                    vehicle_year: 2022,
                };

                const mockGetVehicleById = jest.fn(async () => {
                    return mockVehicleData;
                });

                mockGetVehicle.mockImplementation(mockGetVehicleById);

                request.params.id = 1;

                await VehicleController.getVehicle(request, response);

                expect(response.statusCode).toEqual(200);
                expect(response._isEndCalled()).toBeTruthy();

                const responseData = response._getJSONData();
                expect(responseData).toEqual(mockVehicleData);
            });


            it('should return status 404 and message that this vehicle not exist', async () => {
                const response = httpMocks.createResponse();
                const request = httpMocks.createRequest();

                const mockGetVehicleById = jest.fn(async () => {
                    return null;
                });

                mockGetVehicle.mockImplementation(mockGetVehicleById);

                request.params.id = 1;

                await VehicleController.getVehicle(request, response);

                expect(response.statusCode).toEqual(404);
                expect(response._isEndCalled()).toBeTruthy();

                const responseData = response._getJSONData();
                expect(responseData.error).toEqual('Vehicle not found.');
            });


            it('should return status 500 and error message', async () => {
                const response = httpMocks.createResponse();
                const request = httpMocks.createRequest();

                const errorMessage = 'Internal server error';
                const mockError = new Error(errorMessage);

                const mockGetVehicleById = jest.fn(async () => {
                    throw mockError;
                });

                mockGetVehicle.mockImplementation(mockGetVehicleById);

                const consoleErrorSpy = jest.spyOn(console, 'error');
                consoleErrorSpy.mockImplementation(() => {
                });

                request.params.id = 1;

                await VehicleController.getVehicle(request, response);

                expect(response.statusCode).toEqual(500);
                expect(response._isEndCalled()).toBeTruthy();

                const responseData = response._getJSONData();
                expect(responseData.error).toEqual('An error occurred while fetching the vehicle.');
            });


        });

        describe('update vehicle', () => {

            it('should return status 200 and inform that the vehicle has been updated', async () => {
                const response = httpMocks.createResponse();
                const request = httpMocks.createRequest();

                const mockUpdatedVehicleData = {
                    id: 1,
                    mark_id: 3,
                    vehicle_year: 2023,
                };

                const mockUpdateVehicle = jest.fn(async () => {
                    return mockUpdatedVehicleData;
                });

                mockUpdateVehicleF.mockImplementation(mockUpdateVehicle);

                request.body = {
                    id: 1,
                    mark_id: 3,
                    vehicle_year: 2023,
                };

                await VehicleController.updateVehicle(request, response);

                expect(response.statusCode).toEqual(200);
                expect(response._isEndCalled()).toBeTruthy();

                const responseData = response._getJSONData();
                expect(responseData.message).toEqual('Vehicle updated successfully');
                expect(responseData.vehicle).toEqual(mockUpdatedVehicleData);
            });

            it('should return status 404 if vehicle does not exist' , async () => {
                const response = httpMocks.createResponse();
                const request = httpMocks.createRequest();

                const mockUpdateVehicle = jest.fn(async () => {
                    return null;
                });

                mockUpdateVehicleF.mockImplementation(mockUpdateVehicle);

                request.body = {
                    id: 1,
                    mark_id: 3,
                    vehicle_year: 2023,
                };

                await VehicleController.updateVehicle(request, response);

                expect(response.statusCode).toEqual(404);
                expect(response._isEndCalled()).toBeTruthy();

                const responseData = response._getJSONData();
                expect(responseData.error).toEqual('Vehicle not found');
            });


            it('should return code 409 and an error message when attempting to update an existing vehicle with invalid data', async () => {
                const response = httpMocks.createResponse();
                const request = httpMocks.createRequest();

                const mockUpdateVehicle = jest.fn(async () => {
                    return false;
                });

                mockUpdateVehicleF.mockImplementation(mockUpdateVehicle);

                request.body = {
                    id: 1,
                    mark_id: 3,
                    vehicle_year: '2022',
                };

                await VehicleController.updateVehicle(request, response);

                expect(response.statusCode).toEqual(409);
                expect(response._isEndCalled()).toBeTruthy();

                const responseData = response._getJSONData();
                expect(responseData.error).toEqual('Vehicle with the same mark and vehicle_year already exists');
            });


            it('should return a 400 code and an error message when requesting with invalid data', async () => {
                const response = httpMocks.createResponse();
                const request = httpMocks.createRequest();

                request.body = {
                    id: 'invalid',
                    mark_id: 'invalid',
                    vehicle_year: 'invalid',
                };

                await VehicleController.updateVehicle(request, response);

                expect(response.statusCode).toEqual(400);
                expect(response._isEndCalled()).toBeTruthy();

                const responseData = response._getJSONData();
                expect(responseData.error).toEqual('Invalid or missing data in the request');
            });



            it('should return code 500 and an error message if there is an internal server error', async () => {
                const response = httpMocks.createResponse();
                const request = httpMocks.createRequest();

                const errorMessage = 'Internal server error';
                const mockError = new Error(errorMessage);

                const mockUpdateVehicle = jest.fn(async () => {
                    throw mockError;
                });

                mockUpdateVehicleF.mockImplementation(mockUpdateVehicle);

                request.body = {
                    id: 1,
                    mark_id: 3,
                    vehicle_year: 2023,
                };

                await VehicleController.updateVehicle(request, response);

                expect(response.statusCode).toEqual(500);
                expect(response._isEndCalled()).toBeTruthy();

                const responseData = response._getJSONData();
                expect(responseData.error).toEqual('An error occurred while updating the vehicle');
            });



        });

    });

});
