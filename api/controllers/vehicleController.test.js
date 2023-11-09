const httpMocks = require('node-mocks-http');
jest.mock('../services/vehicleService');

const VehicleService = require('../services/vehicleService');
const VehicleController = require('./VehicleController');

const mockFetchVehicles = jest.spyOn(VehicleService, 'getAllVehicles');
const mockSaveVehicle = jest.spyOn(VehicleService, 'createVehicle');
const mockGetVehicle  = jest.spyOn(VehicleService, 'getVehicleById');
const mockUpdateVehicle  = jest.spyOn(VehicleService, 'updateVehicle');
const mockDeleteVehicle  = jest.spyOn(VehicleService, 'deleteVehicleById');

const mockVehicles = [
    { id: 1, mark_id: '3', vehicle_year: '2002' },
    { id: 2, mark_id: '2', vehicle_year: '2012' },
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


    });

});
