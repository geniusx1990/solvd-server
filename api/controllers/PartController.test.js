const PartController = require('./PartController');
const PartService = require('../services/partService');
const UserService = require("../services/userService");
const UserController = require("./UserController");

describe('Part Controller', function () {
    describe('getParts', function () {
        it('should return all parts with 200 status if no query parameters are provided', async () => {
            const allParts = [
                { id: 1, name: 'Engine Oil' },
                { id: 2, name: 'Oil filter' },
            ];

            const getAllPartsSpy = jest.spyOn(PartService, 'getAllParts').mockResolvedValue(allParts);

            const request = {
                query: {},
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await PartController.getParts(request, response);

            expect(getAllPartsSpy).toHaveBeenCalled();
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(allParts);
        });

        it('should return parts for a specific vehicle with 200 status if both mark_id and vehicle_year are provided', async () => {
            const markId = 1;
            const vehicleYear = 2022;
            const filteredParts = [
                { id: 1, name: 'Engine Oil' },
                { id: 2, name: 'Oil filter' },
            ];

            const getPartsForVehicleSpy = jest.spyOn(PartService, 'getPartsForVehicle').mockResolvedValue(filteredParts);

            const request = {
                query: { mark_id: markId, vehicle_year: vehicleYear },
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await PartController.getParts(request, response);

            expect(getPartsForVehicleSpy).toHaveBeenCalledWith(markId, vehicleYear);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(filteredParts);
        });

        it('should handle errors and return a 500 status', async () => {
            const originalConsoleError = console.error;
            console.error = jest.fn();
            const getAllPartsSpy = jest.spyOn(PartService, 'getAllParts').mockRejectedValue(new Error('Test Error'));

            const request = {
                query: {},
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await PartController.getParts(request, response);

            expect(getAllPartsSpy).toHaveBeenCalled();
            expect(response.status).toHaveBeenCalledWith(500);
            expect(response.json).toHaveBeenCalledWith({ error: "An error occurred while fetching parts." });
        });
    });


    describe('createPart', function () {

        it('should create a part and return 201 status with part details', async () => {
            const request = {
                body: {
                    part_name: 'Air filter',
                    description: 'Engine air filter',
                    price: 50.00,
                    availability: true,
                    repair_cost: 20.00,
                    repair_time: 2,
                    vehicle_id: 1,
                },
            };

            const createdPart = { id: 1, ...request.body };
            const createPartSpy = jest.spyOn(PartService, 'createPart').mockResolvedValue(createdPart);

            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await PartController.createPart(request, response);

            expect(createPartSpy).toHaveBeenCalledWith(...Object.values(request.body));
            expect(response.status).toHaveBeenCalledWith(201);
            expect(response.json).toHaveBeenCalledWith({
                part: createdPart,
                message: 'Part created successfully',
            });
        });

        it('should return a 400 status with an error message for invalid input', async () => {
            const request = {
                body: {
                    part_name: 'Invalid Part',
                    price: -10.00,
                    availability: true,
                    repair_cost: 15.00,
                    repair_time: 'NaN',
                    vehicle_id: 'invalid_id',
                },
            };

            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await PartController.createPart(request, response);

            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({ error: 'Invalid input. Please provide valid data and a positive price.' });
        });

        it('should return a 404 status with an error message for a non-existent vehicle', async () => {
            const request = {
                body: {
                    part_name: 'New Part',
                    description: 'Description',
                    price: 50.00,
                    availability: true,
                    repair_cost: 20.00,
                    repair_time: 2,
                    vehicle_id: 999,
                },
            };

            const createPartSpy = jest.spyOn(PartService, 'createPart').mockResolvedValue(null);

            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await PartController.createPart(request, response);

            expect(createPartSpy).toHaveBeenCalledWith(...Object.values(request.body));
            expect(response.status).toHaveBeenCalledWith(404);
            expect(response.json).toHaveBeenCalledWith({ error: 'This vehicle does not exist.' });
        });

        it('should return a 409 status with an error message for a duplicate part', async () => {
            const request = {
                body: {
                    part_name: 'Duplicate Part',
                    description: 'Description',
                    price: 50.00,
                    availability: true,
                    repair_cost: 20.00,
                    repair_time: 2,
                    vehicle_id: 1,
                },
            };

            const createPartSpy = jest.spyOn(PartService, 'createPart').mockResolvedValue(false);

            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await PartController.createPart(request, response);

            expect(createPartSpy).toHaveBeenCalledWith(...Object.values(request.body));
            expect(response.status).toHaveBeenCalledWith(409);
            expect(response.json).toHaveBeenCalledWith({ error: 'Part with the same name for this vehicle already exists.' });
        });



    });

    describe('getPart', function () {
        it('should return a part with 200 status if part is found', async () => {
            const partId = 1;
            const mockPart = { id: partId, name: 'Test Part' };

            const getPartByIDSpy = jest.spyOn(PartService, 'getPartByID').mockResolvedValue(mockPart);

            const request = {
                params: { id: partId },
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await PartController.getPart(request, response);

            expect(getPartByIDSpy).toHaveBeenCalledWith(partId);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(mockPart);
        });

        it('should return 404 status if part is not found', async () => {
            const partId = 1;

            const getPartByIDSpy = jest.spyOn(PartService, 'getPartByID').mockResolvedValue(null);

            const request = {
                params: { id: partId },
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await PartController.getPart(request, response);

            expect(getPartByIDSpy).toHaveBeenCalledWith(partId);
            expect(response.status).toHaveBeenCalledWith(404);
            expect(response.json).toHaveBeenCalledWith({ error: 'Part not found.' });
        });

        it('should handle errors and return a 500 status', async () => {
            const partId = 1;
            const originalConsoleError = console.error;
            console.error = jest.fn();

            const getPartByIDSpy = jest.spyOn(PartService, 'getPartByID').mockRejectedValue(new Error('Test Error'));

            const request = {
                params: { id: partId },
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await PartController.getPart(request, response);

            expect(getPartByIDSpy).toHaveBeenCalledWith(partId);
            expect(response.status).toHaveBeenCalledWith(500);
            expect(response.json).toHaveBeenCalledWith({ error: 'An error occurred while fetching the part.' });
        });
    });


    describe('updatePart', function () {
        it('should update a part and return 200 status if part is found', async () => {
            const partData = {
                id: 1,
                part_name: 'Updated Part',
                description: 'Updated description',
                price: 50,
                availability: true,
                repair_cost: 25,
                repair_time: 2,
                vehicle_id: 1,
            };

            const updatePartSpy = jest.spyOn(PartService, 'updatePart').mockResolvedValue(partData);

            const request = {
                body: partData,
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await PartController.updatePart(request, response);

            expect(updatePartSpy).toHaveBeenCalledWith(
                partData.id,
                partData.part_name,
                partData.description,
                partData.price,
                partData.availability,
                partData.repair_cost,
                partData.repair_time,
                partData.vehicle_id
            );
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith({
                part: partData,
                message: 'Part updated successfully',
            });
        });

        it('should return 404 status if vehicle does not exist', async () => {
            const partData = {
                id: 1,
                part_name: 'Updated Part',
                description: 'Updated description',
                price: 50,
                availability: true,
                repair_cost: 25,
                repair_time: 2,
                vehicle_id: 1,
            };

            const updatePartSpy = jest.spyOn(PartService, 'updatePart').mockResolvedValue(true);

            const request = {
                body: partData,
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await PartController.updatePart(request, response);

            expect(updatePartSpy).toHaveBeenCalledWith(
                partData.id,
                partData.part_name,
                partData.description,
                partData.price,
                partData.availability,
                partData.repair_cost,
                partData.repair_time,
                partData.vehicle_id
            );
            expect(response.status).toHaveBeenCalledWith(404);
            expect(response.json).toHaveBeenCalledWith({ error: 'This vehicle does not exist.' });
        });

        it('should return 409 status if part with the same name for the vehicle already exists', async () => {
            const partData = {
                id: 1,
                part_name: 'Updated Part',
                description: 'Updated description',
                price: 50,
                availability: true,
                repair_cost: 25,
                repair_time: 2,
                vehicle_id: 1,
            };

            const updatePartSpy = jest.spyOn(PartService, 'updatePart').mockResolvedValue(false);

            const request = {
                body: partData,
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await PartController.updatePart(request, response);

            expect(updatePartSpy).toHaveBeenCalledWith(
                partData.id,
                partData.part_name,
                partData.description,
                partData.price,
                partData.availability,
                partData.repair_cost,
                partData.repair_time,
                partData.vehicle_id
            );
            expect(response.status).toHaveBeenCalledWith(409);
            expect(response.json).toHaveBeenCalledWith({ error: 'Part with the same name for this vehicle already exists.' });
        });

        it('should return 404 status if part is not found', async () => {
            const partData = {
                id: 1,
                part_name: 'Updated Part',
                description: 'Updated description',
                price: 50,
                availability: true,
                repair_cost: 25,
                repair_time: 2,
                vehicle_id: 1,
            };

            const updatePartSpy = jest.spyOn(PartService, 'updatePart').mockResolvedValue(null);

            const request = {
                body: partData,
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await PartController.updatePart(request, response);

            expect(updatePartSpy).toHaveBeenCalledWith(
                partData.id,
                partData.part_name,
                partData.description,
                partData.price,
                partData.availability,
                partData.repair_cost,
                partData.repair_time,
                partData.vehicle_id
            );
            expect(response.status).toHaveBeenCalledWith(404);
            expect(response.json).toHaveBeenCalledWith({ error: 'Part not found' });
        });

        it('should handle errors and return a 500 status', async () => {
            const originalConsoleError = console.error;
            console.error = jest.fn();

            const partData = {
                id: 1,
                part_name: 'Updated Part',
                description: 'Updated description',
                price: 50,
                availability: true,
                repair_cost: 25,
                repair_time: 2,
                vehicle_id: 1,
            };

            const updatePartSpy = jest.spyOn(PartService, 'updatePart').mockRejectedValue(new Error('Test Error'));

            const request = {
                body: partData,
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await PartController.updatePart(request, response);

            expect(updatePartSpy).toHaveBeenCalledWith(
                partData.id,
                partData.part_name,
                partData.description,
                partData.price,
                partData.availability,
                partData.repair_cost,
                partData.repair_time,
                partData.vehicle_id
            );
            expect(response.status).toHaveBeenCalledWith(500);
            expect(response.json).toHaveBeenCalledWith({ error: 'An error occurred while updating the part' });
        });
    });

    describe('deletePart', function () {
        it('should delete a part and return 200 status if part is found', async () => {
            const partId = 1;
            const mockDeletedPart = { id: partId, name: 'Deleted Part' };

            const deletePartByIdSpy = jest.spyOn(PartService, 'deletePartById').mockResolvedValue(mockDeletedPart);

            const request = {
                params: { id: partId },
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await PartController.deletePart(request, response);

            expect(deletePartByIdSpy).toHaveBeenCalledWith(partId);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith({
                part: mockDeletedPart,
                message: 'Part deleted successfully',
            });
        });

        it('should return 404 status if part is not found', async () => {
            const partId = 1;

            const deletePartByIdSpy = jest.spyOn(PartService, 'deletePartById').mockResolvedValue(null);

            const request = {
                params: { id: partId },
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await PartController.deletePart(request, response);

            expect(deletePartByIdSpy).toHaveBeenCalledWith(partId);
            expect(response.status).toHaveBeenCalledWith(404);
            expect(response.json).toHaveBeenCalledWith({ error: 'Part not found' });
        });

        it('should handle errors and return a 500 status', async () => {
            const originalConsoleError = console.error;
            console.error = jest.fn();
            const partId = 1;

            const deletePartByIdSpy = jest.spyOn(PartService, 'deletePartById').mockRejectedValue(new Error('Test Error'));

            const request = {
                params: { id: partId },
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await PartController.deletePart(request, response);

            expect(deletePartByIdSpy).toHaveBeenCalledWith(partId);
            expect(response.status).toHaveBeenCalledWith(500);
            expect(response.json).toHaveBeenCalledWith({ error: 'An error occurred while deleting the part' });
        });
    });






});
