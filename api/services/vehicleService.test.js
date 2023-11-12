const VehicleService = require('./vehicleService');
const {describe, it, expect} = require("@jest/globals");

const client = require('../configs/database');

jest.mock('../configs/database');

describe('Vehicle Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('Get all Vehicles', () => {
        it('should fetch all vehicles from the database', async () => {
            const queryMock = jest.spyOn(client, 'query');
            queryMock.mockResolvedValueOnce({
                rows: [{id: 1, mark_id: 2, vehicle_year: 2022}, {
                    id: 2,
                    mark_id: 3,
                    vehicle_year: 2018
                }]
            });

            const result = await VehicleService.getAllVehicles();

            expect(queryMock).toHaveBeenCalledWith('SELECT * FROM vehicle ORDER BY id ASC');
            expect(result).toEqual([{id: 1, mark_id: 2, vehicle_year: 2022}, {
                id: 2,
                mark_id: 3,
                vehicle_year: 2018
            }]);
        });

        it('should handle database error during vehicle retrieval', async () => {
            const queryMock = jest.spyOn(client, 'query');
            queryMock.mockRejectedValueOnce(new Error('Database error'));

            jest.spyOn(console, 'error').mockImplementation(() => {
            });

            await expect(VehicleService.getAllVehicles()).rejects.toThrow('An error occurred while fetching vehicles.');
        });

    });

    describe('Create vehicle', () => {

        it('should create a new vehicle', async () => {
            const markId = 1;
            const vehicleYear = 2022;
            const newVehicle = {id: 1, mark_id: markId, vehicle_year: vehicleYear};

            const existingVehicleQueryMock = jest.spyOn(client, 'query');
            existingVehicleQueryMock.mockResolvedValueOnce({rows: []});

            const createVehicleQueryMock = jest.spyOn(client, 'query');
            createVehicleQueryMock.mockResolvedValueOnce({rows: [newVehicle]});

            const result = await VehicleService.createVehicle(markId, vehicleYear);

            expect(existingVehicleQueryMock).toHaveBeenCalledWith('SELECT * FROM vehicle WHERE mark_id = $1 AND vehicle_year = $2', [markId, vehicleYear]);
            expect(createVehicleQueryMock).toHaveBeenCalledWith('INSERT INTO vehicle (mark_id, vehicle_year) VALUES ($1, $2) RETURNING *', [markId, vehicleYear]);
            expect(result).toEqual(newVehicle);
        });

        it('should return null if vehicle already exists', async () => {
            const markId = 1;
            const vehicleYear = 2022;
            const existingVehicle = {id: 1, mark_id: 1, vehicle_year: 2022};

            const existingVehicleQueryMock = jest.spyOn(client, 'query');
            existingVehicleQueryMock.mockResolvedValueOnce({rows: [existingVehicle]});

            const createVehicleQueryMock = jest.spyOn(client, 'query');

            const result = await VehicleService.createVehicle(markId, vehicleYear);

            expect(existingVehicleQueryMock).toHaveBeenCalledWith('SELECT * FROM vehicle WHERE mark_id = $1 AND vehicle_year = $2', [markId, vehicleYear]);
            expect(createVehicleQueryMock).toHaveBeenCalled();
            expect(result).toBeNull();
        });

        it('should handle database error during vehicle creation', async () => {
            const markId = 1;
            const vehicleYear = 2022;

            const existingVehicleQueryMock = jest.spyOn(client, 'query');
            existingVehicleQueryMock.mockRejectedValueOnce(new Error('Database error'));

            jest.spyOn(console, 'error').mockImplementation(() => {
            });

            await expect(VehicleService.createVehicle(markId, vehicleYear)).rejects.toThrow('An error occurred while creating vehicle.');
        });
    });

    describe('VehicleService', () => {

        it('should return the vehicle if it exists', async () => {
            const vehicleId = 1;
            const expectedVehicle = {id: vehicleId, mark_id: 1, vehicle_year: 2022};

            const queryMock = jest.spyOn(client, 'query');
            queryMock.mockResolvedValueOnce({rows: [expectedVehicle]});

            const result = await VehicleService.getVehicleById(vehicleId);

            expect(queryMock).toHaveBeenCalledWith('SELECT * FROM vehicle WHERE id = $1', [vehicleId]);
            expect(result).toEqual(expectedVehicle);
        });

        it('should return null if vehicle does not exist', async () => {
            const vehicleId = 999;
            const queryMock = jest.spyOn(client, 'query');
            queryMock.mockResolvedValueOnce({rows: []});

            const result = await VehicleService.getVehicleById(vehicleId);

            expect(queryMock).toHaveBeenCalledWith('SELECT * FROM vehicle WHERE id = $1', [vehicleId]);
            expect(result).toBeNull();
        });

        it('should handle database error during vehicle retrieval by ID', async () => {
            const vehicleId = 1;
            const queryMock = jest.spyOn(client, 'query');
            queryMock.mockRejectedValueOnce(new Error('Database error'));

            jest.spyOn(console, 'error').mockImplementation(() => {
            });

            await expect(VehicleService.getVehicleById(vehicleId)).rejects.toThrow('An error occurred while fetching the vehicle.');
        });
    });

    describe('VehicleService', () => {

        it('should update the vehicle', async () => {
            const vehicleId = 1;
            const markId = 2;
            const vehicleYear = 2023;
            const updatedVehicle = {id: vehicleId, mark_id: markId, vehicle_year: vehicleYear};

            const existingVehicleQueryMock = jest.spyOn(client, 'query');
            existingVehicleQueryMock.mockResolvedValueOnce({rows: []});

            const updateVehicleQueryMock = jest.spyOn(client, 'query');
            updateVehicleQueryMock.mockResolvedValueOnce({rows: [updatedVehicle]});

            const result = await VehicleService.updateVehicle(vehicleId, markId, vehicleYear);

            expect(existingVehicleQueryMock).toHaveBeenCalledWith('SELECT * FROM vehicle WHERE mark_id = $1 AND vehicle_year = $2', [markId, vehicleYear]);
            expect(updateVehicleQueryMock).toHaveBeenCalledWith('UPDATE vehicle SET mark_id = $1, vehicle_year = $2 WHERE id = $3 RETURNING *', [markId, vehicleYear, vehicleId]);
            expect(result).toEqual(updatedVehicle);
        });

        it('should return false if vehicle already exists during update', async () => {
            const vehicleId = 1;
            const markId = 2;
            const vehicleYear = 2023;
            const existingVehicle = {id: vehicleId, mark_id: markId, vehicle_year: vehicleYear};

            const existingVehicleQueryMock = jest.spyOn(client, 'query');
            existingVehicleQueryMock.mockResolvedValueOnce({rows: [existingVehicle]});

            const updateVehicleQueryMock = jest.spyOn(client, 'query');

            const result = await VehicleService.updateVehicle(vehicleId, markId, vehicleYear);

            expect(existingVehicleQueryMock).toHaveBeenCalledWith('SELECT * FROM vehicle WHERE mark_id = $1 AND vehicle_year = $2', [markId, vehicleYear]);
            expect(updateVehicleQueryMock).toHaveBeenCalled();
            expect(result).toBe(false);
        });

        it('should return null if vehicle does not exist during update', async () => {
            const vehicleId = 999;
            const markId = 2;
            const vehicleYear = 2023;

            const existingVehicleQueryMock = jest.spyOn(client, 'query');
            existingVehicleQueryMock.mockResolvedValueOnce({rows: []});

            const updateVehicleQueryMock = jest.spyOn(client, 'query');
            updateVehicleQueryMock.mockResolvedValueOnce({ rows: [] });

            const result = await VehicleService.updateVehicle(vehicleId, markId, vehicleYear);

            expect(existingVehicleQueryMock).toHaveBeenCalledWith('SELECT * FROM vehicle WHERE mark_id = $1 AND vehicle_year = $2', [markId, vehicleYear]);
            expect(updateVehicleQueryMock).toHaveBeenCalled();
            expect(result).toBeNull();
        });

        it('should handle database error during vehicle update', async () => {
            const vehicleId = 1;
            const markId = 2;
            const vehicleYear = 2023;

            const existingVehicleQueryMock = jest.spyOn(client, 'query');
            existingVehicleQueryMock.mockResolvedValueOnce({rows: []});

            const updateVehicleQueryMock = jest.spyOn(client, 'query');
            updateVehicleQueryMock.mockRejectedValueOnce(new Error('Database error'));

            jest.spyOn(console, 'error').mockImplementation(() => {
            });

            await expect(VehicleService.updateVehicle(vehicleId, markId, vehicleYear)).rejects.toThrow('An error occurred while updating the vehicle.');
        });
    });


});

