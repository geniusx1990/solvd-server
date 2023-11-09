const MarkService = require('./markService');
const client = require('../configs/database');

jest.mock('../configs/database');

describe('Mark Service', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllMarks', () => {
        it('should list marks', async () => {

            const mockQueryData = {
                rows: [
                    {
                        "id": 4,
                        "mark": "Audi"
                    }
                ],
            };
            client.query.mockResolvedValue(mockQueryData);

            const marks = await MarkService.getAllMarks();
            expect(marks).toEqual(mockQueryData.rows);
        });

        it('should handle the error and throw an exception', async () => {
            const errorMessage = 'Database error';
            client.query.mockRejectedValue(new Error(errorMessage));

            try {
                await MarkService.getAllMarks();
            } catch (error) {
                expect(error.message).toBe('An error occurred while fetching marks.');
            }
        });
    });

    describe('createMark', () => {

        it('should create mark and return result', async () => {
            const mockInsertData = {
                rows: [
                    { id: 1, mark: 'Honda' }
                ],
            };
            client.query.mockResolvedValue(mockInsertData);


            const mark = 'Honda';
            const createdMark = await MarkService.createMark(mark);
            expect(createdMark).toEqual(mockInsertData.rows[0]);
        });

        it('should handle the error and throw an exception', async () => {
            const errorMessage = 'Database error';
            client.query.mockRejectedValue(new Error(errorMessage));

            try {
                await MarkService.createMark('Honda');
            } catch (error) {
                expect(error.message).toBe('An error occurred while creating mark.');
            }
        });
    });

    describe('getMarkById', () => {
        it('should return mark by id', async () => {
            const mockMarkId = 1;
            const mockQueryResult = {
                rows: [
                    { id: mockMarkId, name: 'Mercedes-Benz' }
                ],
            };
            client.query.mockResolvedValue(mockQueryResult);

            const mark = await MarkService.getMarkById(mockMarkId);
            expect(mark).toEqual(mockQueryResult.rows[0]);
        });

        it("should return null if mark doesn't exist", async () => {
            const mockMarkId = 999;
            const mockQueryResult = {
                rows: [],
            };
            client.query.mockResolvedValue(mockQueryResult);

            const mark = await MarkService.getMarkById(mockMarkId);
            expect(mark).toBeNull();
        });

        it('should handle the error and throw an exception', async () => {
            const mockMarkId = 1;
            const errorMessage = 'Database error';
            client.query.mockRejectedValue(new Error(errorMessage));

            try {
                await MarkService.getMarkById(mockMarkId);
            } catch (error) {
                expect(error.message).toBe('An error occurred while fetching the mark.');
            }
        });
    });

    describe('updateMark', () => {
        it('should update parm', async () => {
            const mockMarkId = 1;
            const mockNewMark = 'KIA';
            const mockQueryResult = {
                rows: [
                    { id: mockMarkId, mark: mockNewMark }
                ],
            };
            client.query.mockResolvedValue(mockQueryResult);

            const updatedMark = await MarkService.updateMark(mockMarkId, mockNewMark);
            expect(updatedMark).toEqual(mockQueryResult.rows[0]);
        });

        it('should return null if mark does not exist', async () => {
            const mockMarkId = 999;
            const mockNewMark = 'KIA';
            const mockQueryResult = {
                rows: [],
            };
            client.query.mockResolvedValue(mockQueryResult);

            const updatedMark = await MarkService.updateMark(mockMarkId, mockNewMark);
            expect(updatedMark).toBeNull();
        });

        it('should handle the error and throw an exception', async () => {
            const mockMarkId = 1;
            const mockNewMark = 'KIA';
            const errorMessage = 'Database error';
            client.query.mockRejectedValue(new Error(errorMessage));

            try {
                await MarkService.updateMark(mockMarkId, mockNewMark);
            } catch (error) {
                expect(error.message).toBe('An error occurred while updating the mark.');
            }
        });
    });

    describe('deleteMarkById', () => {
        it('should delete mark by id', async () => {
            const mockMarkId = 1;
            const mockQueryResult = {
                rows: [
                    { id: mockMarkId, mark: 'Deleted Mark' }
                ],
            };
            client.query.mockResolvedValue(mockQueryResult);

            const deletedMark = await MarkService.deleteMarkById(mockMarkId);
            expect(deletedMark).toEqual(mockQueryResult.rows[0]);
        });

        it('should return null if mark does not exist', async () => {
            const mockMarkId = 999;
            const mockQueryResult = {
                rows: [],
            };
            client.query.mockResolvedValue(mockQueryResult);

            const deletedMark = await MarkService.deleteMarkById(mockMarkId);
            expect(deletedMark).toBeNull();
        });

        it('should handle the error and throw an exception', async () => {
            const mockMarkId = 1;
            const errorMessage = 'Database error';
            client.query.mockRejectedValue(new Error(errorMessage));

            try {
                await MarkService.deleteMarkById(mockMarkId);
            }
            catch (error) {
                expect(error.message).toBe('An error occurred while deleting the mark.');
            }
        });
    });

});
