const PartService = require('./partService');
const {describe, it, expect} = require("@jest/globals");

const client = require('../configs/database');

jest.mock('../configs/database');

describe('Part Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('Get all parts', () => {

        it('should fetch all parts from the database', async () => {
            const expectedParts = [{id: 1, name: 'Part 1'}, {id: 2, name: 'Part 2'}];

            client.query.mockResolvedValueOnce({rows: expectedParts});

            const result = await PartService.getAllParts();
            expect(client.query).toHaveBeenCalledWith('SELECT * FROM parts ORDER BY id ASC');
            expect(result).toEqual(expectedParts);
        });

        it('should handle database error', async () => {
            client.query.mockRejectedValueOnce(new Error('Database error'));

            jest.spyOn(console, 'error').mockImplementation(() => {
            });

            await expect(PartService.getAllParts()).rejects.toThrow('An error occurred while fetching parts.');
        });
    });

    describe('PartService', () => {

        it('should create a new part in the database', async () => {
            const part_name = 'New Part';
            const description = 'Description';
            const price = 100;
            const availability = true;
            const repair_cost = 50;
            const repair_time = 2;
            const vehicle_id = 1;

            client.query.mockResolvedValueOnce({rows: [{id: 1, name: 'Vehicle 1'}]});
            client.query.mockResolvedValueOnce({rows: []});

            const expectedPart = {
                id: 1,
                part_name,
                description,
                price,
                availability,
                repair_cost,
                repair_time,
                vehicle_id
            };
            client.query.mockResolvedValueOnce({rows: [expectedPart]});

            const result = await PartService.createPart(part_name, description, price, availability, repair_cost, repair_time, vehicle_id);

            expect(client.query).toHaveBeenCalledWith('SELECT * FROM vehicle WHERE id = $1', [vehicle_id]);
            expect(client.query).toHaveBeenCalledWith('SELECT * FROM parts WHERE part_name = $1 AND vehicle_id = $2', [part_name, vehicle_id]);
            expect(client.query).toHaveBeenCalledWith('INSERT INTO parts (part_name, description, price, availability, repair_cost, repair_time, vehicle_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [part_name, description, price, availability, repair_cost, repair_time, vehicle_id]);

            expect(result).toEqual(expectedPart);
        });

        it('should return null if the vehicle does not exist', async () => {
            const part_name = 'New Part';
            const description = 'Description';
            const price = 100;
            const availability = true;
            const repair_cost = 50;
            const repair_time = 2;
            const vehicle_id = 1;

            client.query.mockResolvedValueOnce({rows: []});

            const result = await PartService.createPart(part_name, description, price, availability, repair_cost, repair_time, vehicle_id);

            expect(client.query).toHaveBeenCalledWith('SELECT * FROM vehicle WHERE id = $1', [vehicle_id]);
            expect(client.query).not.toHaveBeenCalledWith('SELECT * FROM parts WHERE part_name = $1 AND vehicle_id = $2', [part_name, vehicle_id]);
            expect(client.query).not.toHaveBeenCalledWith('INSERT INTO parts (part_name, description, price, availability, repair_cost, repair_time, vehicle_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [part_name, description, price, availability, repair_cost, repair_time, vehicle_id]);

            expect(result).toBeNull();
        });

        it('should handle database error', async () => {
            const part_name = 'New Part';
            const description = 'Description';
            const price = 100;
            const availability = true;
            const repair_cost = 50;
            const repair_time = 2;
            const vehicle_id = 1;

            client.query.mockRejectedValueOnce(new Error('Database error'));

            jest.spyOn(console, 'error').mockImplementation(() => {
            });

            await expect(PartService.createPart(part_name, description, price, availability, repair_cost, repair_time, vehicle_id)).rejects.toThrow('An error occurred while creating a part.');
        });
    });

    describe('Get part by Id', () => {

        it('should return null if the part does not exist', async () => {
            const partId = 999;

            const queryMock = jest.spyOn(client, 'query');
            queryMock.mockResolvedValueOnce({rows: []});

            const result = await PartService.getPartByID(partId);

            expect(queryMock).toHaveBeenCalledWith('SELECT * FROM parts WHERE id = $1', [partId]);
            expect(result).toBeNull();
        });

        it('should return the part if it exists', async () => {
            const partId = 1;
            const expectedPart = {id: 1, part_name: 'Test Part', description: 'Test Description', /* other fields */};

            const queryMock = jest.spyOn(client, 'query');
            queryMock.mockResolvedValueOnce({rows: [expectedPart]});

            const result = await PartService.getPartByID(partId);

            expect(queryMock).toHaveBeenCalledWith('SELECT * FROM parts WHERE id = $1', [partId]);
            expect(result).toEqual(expectedPart);
        });

        it('should handle database error', async () => {
            const partId = 1;

            const queryMock = jest.spyOn(client, 'query');
            queryMock.mockRejectedValueOnce(new Error('Database error'));

            jest.spyOn(console, 'error').mockImplementation(() => {
            });

            await expect(PartService.getPartByID(partId)).rejects.toThrow('An error occurred while fetching the part.');
        });
    });

    describe('updatePart', () => {
        it('should return true if the vehicle does not exist', async () => {
            const partId = 1;
            const part_name = 'Updated Part';
            const description = 'Updated Description';
            const price = 150;
            const availability = true;
            const repair_cost = 75;
            const repair_time = 3;
            const vehicle_id = 999;

            const existingVehicleQueryMock = jest.spyOn(client, 'query');
            existingVehicleQueryMock.mockResolvedValueOnce({rows: []});

            const result = await PartService.updatePart(partId, part_name, description, price, availability, repair_cost, repair_time, vehicle_id);

            expect(existingVehicleQueryMock).toHaveBeenCalledWith('SELECT * FROM vehicle WHERE id = $1', [vehicle_id]);
            expect(result).toBe(true);
        });

        it('should return false if the part already exists for the given vehicle', async () => {
            const partId = 1;
            const part_name = 'Engine oil';
            const description = 'Description';
            const price = 100;
            const availability = true;
            const repair_cost = 50;
            const repair_time = 2;
            const vehicle_id = 1;

            const existingVehicleQueryMock = jest.spyOn(client, 'query');
            existingVehicleQueryMock.mockResolvedValueOnce({
                rows: [
                    {
                        id: vehicle_id,
                    }
                ]
            });

            const existingPartQueryMock = jest.spyOn(client, 'query');
            existingPartQueryMock.mockResolvedValueOnce({
                rows: [
                    {
                        id: partId,
                        part_name,
                        description,
                        price,
                        availability,
                        repair_cost,
                        repair_time,
                        vehicle_id
                    }
                ]
            });

            const result = await PartService.updatePart(partId, part_name, description, price, availability, repair_cost, repair_time, vehicle_id);

            expect(existingVehicleQueryMock).toHaveBeenCalledWith('SELECT * FROM vehicle WHERE id = $1', [vehicle_id]);
            expect(existingPartQueryMock).toHaveBeenCalledWith('SELECT * FROM parts WHERE part_name = $1 AND vehicle_id = $2', [part_name, vehicle_id]);

            expect(result).toBe(false);
        });

        it('should return the updated part if the update is successful', async () => {
            const partId = 1;
            const part_name = 'Engine filter';
            const description = 'Description';
            const price = 150;
            const availability = true;
            const repair_cost = 75;
            const repair_time = 3;
            const vehicle_id = 1;

            const existingVehicleQueryMock = jest.spyOn(client, 'query');
            existingVehicleQueryMock.mockResolvedValueOnce({
                rows: [
                    {
                        id: vehicle_id,
                    }
                ]
            });

            const existingPartQueryMock = jest.spyOn(client, 'query');
            existingPartQueryMock.mockResolvedValueOnce({
                rows: []
            });

            const updatePartQueryMock = jest.spyOn(client, 'query');
            const updatedPartData = {
                id: partId,
                part_name,
                description,
                price,
                availability,
                repair_cost,
                repair_time,
                vehicle_id
            };
            updatePartQueryMock.mockResolvedValueOnce({
                rows: [updatedPartData]
            });

            const result = await PartService.updatePart(partId, part_name, description, price, availability, repair_cost, repair_time, vehicle_id);

            expect(existingVehicleQueryMock).toHaveBeenCalledWith('SELECT * FROM vehicle WHERE id = $1', [vehicle_id]);
            expect(existingPartQueryMock).toHaveBeenCalledWith('SELECT * FROM parts WHERE part_name = $1 AND vehicle_id = $2', [part_name, vehicle_id]);
            expect(updatePartQueryMock).toHaveBeenCalledWith('UPDATE parts SET part_name = $1, description = $2, price = $3, availability = $4, repair_cost = $5, repair_time = $6, vehicle_id = $7 WHERE id = $8 RETURNING *',
                [part_name, description, price, availability, repair_cost, repair_time, vehicle_id, partId]);

            expect(result).toEqual(updatedPartData);
        });

        it('should return null if the update is unsuccessful', async () => {
            const partId = 1;
            const part_name = 'Updated Part';
            const description = 'Updated Description';
            const price = 150;
            const availability = true;
            const repair_cost = 75;
            const repair_time = 3;
            const vehicle_id = 1;

            const existingVehicleQueryMock = jest.spyOn(client, 'query');
            existingVehicleQueryMock.mockResolvedValueOnce({
                rows: [
                    {
                        id: vehicle_id,
                    }
                ]
            });

            const existingPartQueryMock = jest.spyOn(client, 'query');
            existingPartQueryMock.mockResolvedValueOnce({
                rows: []
            });

            const updatePartQueryMock = jest.spyOn(client, 'query');
            updatePartQueryMock.mockResolvedValueOnce({
                rows: []
            });

            const result = await PartService.updatePart(partId, part_name, description, price, availability, repair_cost, repair_time, vehicle_id);

            expect(existingVehicleQueryMock).toHaveBeenCalledWith('SELECT * FROM vehicle WHERE id = $1', [vehicle_id]);
            expect(existingPartQueryMock).toHaveBeenCalledWith('SELECT * FROM parts WHERE part_name = $1 AND vehicle_id = $2', [part_name, vehicle_id]);
            expect(updatePartQueryMock).toHaveBeenCalledWith('UPDATE parts SET part_name = $1, description = $2, price = $3, availability = $4, repair_cost = $5, repair_time = $6, vehicle_id = $7 WHERE id = $8 RETURNING *',
                [part_name, description, price, availability, repair_cost, repair_time, vehicle_id, partId]);

            expect(result).toBeNull();
        });

    });


});
