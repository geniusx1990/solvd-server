const MarkController = require('./MarkController');
const MarkService = require('../services/markService');

describe('Mark Controller', function () {
    describe('GetAllMarks', function () {
        it('Should get data of marks', async () => {
            const getAllMarksSpy = jest.spyOn(MarkService, 'getAllMarks').mockResolvedValue([
                {
                    "id": 4,
                    "mark": "Audi"
                },
                {
                    "id": 5,
                    "mark": "BMW"
                }
            ]);

            const request = {};
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await MarkController.getMarks(request, response);

            expect(getAllMarksSpy).toHaveBeenCalled();
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith([
                {
                    "id": 4,
                    "mark": "Audi"
                },
                {
                    "id": 5,
                    "mark": "BMW"
                }
            ]);
        })

        it('should handle errors and return a 500 response', async () => {
            const errorMessage = "Error fetching mark";
            const getAllMarksSpy = jest.spyOn(MarkService, 'getAllMarks').mockRejectedValue(new Error(errorMessage));

            const request = {};
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await MarkController.getMarks(request, response);

            expect(getAllMarksSpy).toHaveBeenCalled();
            expect(response.status).toHaveBeenCalledWith(500);
            expect(response.json).toHaveBeenCalledWith({ error: "An error occurred while fetching marks." });
        });



    })


    describe('CreateMark', function () {

        it('should return 400 status for invalid input', async () => {
            const request = {
                body: {},
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await MarkController.createMark(request, response);

            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({
                error: 'Invalid input: mark is required',
            });
        });

        it('should return a 409 status if mark already exists', async () => {
            const mark = 'Audi';
            const markExistSpy = jest.spyOn(MarkService, 'markExist').mockResolvedValue(true);

            const request = {
                body: { mark },
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await MarkController.createMark(request, response);

            expect(markExistSpy).toHaveBeenCalledWith(mark);
            expect(response.status).toHaveBeenCalledWith(409);
            expect(response.json).toHaveBeenCalledWith({
                error: 'Mark already exists',
            });
        });

        it('should create a new mark and return 201 status', async () => {
            const mark = 'Mercedes-Benz';

            const markExistSpy = jest.spyOn(MarkService, 'markExist').mockResolvedValue(false);
            const createMarkSpy = jest.spyOn(MarkService, 'createMark').mockResolvedValue(mark);

            const request = {
                body: { mark },
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await MarkController.createMark(request, response);

            expect(markExistSpy).toHaveBeenCalledWith(mark);
            expect(createMarkSpy).toHaveBeenCalledWith(mark);
            expect(response.status).toHaveBeenCalledWith(201);
            expect(response.json).toHaveBeenCalledWith({
                mark,
                message: 'Mark created successfully',
            });
        });

        it('should handle errors and return a 500 status', async () => {
            const mark = 'Mercedes-Benz';
            const originalConsoleError = console.error;
            console.error = jest.fn();

            const markExistSpy = jest.spyOn(MarkService, 'markExist').mockRejectedValue(new Error('Test Error'));

            const request = {
                body: { mark },
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await MarkController.createMark(request, response);

            expect(markExistSpy).toHaveBeenCalledWith(mark);
            expect(response.status).toHaveBeenCalledWith(500);
            expect(response.json).toHaveBeenCalledWith({
                error: 'An error occurred while creating a mark.',
            });
        });

    })


    describe('getMark', function () {
        it('should return a mark with 200 status if found', async () => {
            const markId = 1;
            const mockMark = { id: markId, mark: 'Audi' };
            const getMarkByIdSpy = jest.spyOn(MarkService, 'getMarkById').mockResolvedValue(mockMark);

            const request = {
                params: { id: markId },
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await MarkController.getMark(request, response);

            expect(getMarkByIdSpy).toHaveBeenCalledWith(markId);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(mockMark);
        });

        it('should return 404 status if mark not found', async () => {
            const markId = 1;
            const getMarkByIdSpy = jest.spyOn(MarkService, 'getMarkById').mockResolvedValue(null);

            const request = {
                params: { id: markId },
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await MarkController.getMark(request, response);

            expect(getMarkByIdSpy).toHaveBeenCalledWith(markId);
            expect(response.status).toHaveBeenCalledWith(404);
            expect(response.json).toHaveBeenCalledWith({ error: 'Mark not found.' });
        });

        it('should handle errors and return a 500 status', async () => {
            const markId = 1;
            const originalConsoleError = console.error;
            console.error = jest.fn();
            const getMarkByIdSpy = jest.spyOn(MarkService, 'getMarkById').mockRejectedValue(new Error('Test Error'));

            const request = {
                params: { id: markId },
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await MarkController.getMark(request, response);

            expect(getMarkByIdSpy).toHaveBeenCalledWith(markId);
            expect(response.status).toHaveBeenCalledWith(500);
            expect(response.json).toHaveBeenCalledWith({ error: 'An error occurred while fetching the mark.' });
        });
    });

    describe('updateMark', function () {
        it('should update a mark and return 200 status if found', async () => {
            const markData = { id: 1, mark: 'KIA' };
            const updateMarkSpy = jest.spyOn(MarkService, 'updateMark').mockResolvedValue(markData);

            const request = {
                body: markData,
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await MarkController.updateMark(request, response);

            expect(updateMarkSpy).toHaveBeenCalledWith(markData.id, markData.mark);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith({
                message: 'Mark updated successfully',
                updatedMark: markData,
            });
        });

        it('should return 404 status if mark not found', async () => {
            const markData = { id: 1, mark: 'KIA' };
            const updateMarkSpy = jest.spyOn(MarkService, 'updateMark').mockResolvedValue(null);

            const request = {
                body: markData,
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await MarkController.updateMark(request, response);

            expect(updateMarkSpy).toHaveBeenCalledWith(markData.id, markData.mark);
            expect(response.status).toHaveBeenCalledWith(404);
            expect(response.json).toHaveBeenCalledWith({ error: 'Mark not found' });
        });

        it('should return 400 status if ID not specified', async () => {
            const request = {
                body: { mark: 'KIA' },
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await MarkController.updateMark(request, response);

            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({ message: 'ID not specified' });
        });

        it('should handle errors and return a 500 status', async () => {
            const markData = { id: 1, mark: 'KIA' };
            const originalConsoleError = console.error;
            console.error = jest.fn();
            const updateMarkSpy = jest.spyOn(MarkService, 'updateMark').mockRejectedValue(new Error('Test Error'));

            const request = {
                body: markData,
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await MarkController.updateMark(request, response);

            expect(updateMarkSpy).toHaveBeenCalledWith(markData.id, markData.mark);
            expect(response.status).toHaveBeenCalledWith(500);
            expect(response.json).toHaveBeenCalledWith({ error: 'An error occurred while updating the mark' });
        });
    });

    describe('deleteMark', function () {
        it('should delete a mark and return 200 status if found', async () => {
            const markId = 1;
            const deletedMark = { id: markId, mark: 'Audi' };
            const deleteMarkByIdSpy = jest.spyOn(MarkService, 'deleteMarkById').mockResolvedValue(deletedMark);

            const request = {
                params: { id: markId },
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await MarkController.deleteMark(request, response);

            expect(deleteMarkByIdSpy).toHaveBeenCalledWith(markId);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith({
                message: 'Mark deleted successfully',
                deletedMark,
            });
        });

        it('should return 404 status if mark not found', async () => {
            const markId = 1;
            const deleteMarkByIdSpy = jest.spyOn(MarkService, 'deleteMarkById').mockResolvedValue(null);

            const request = {
                params: { id: markId },
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await MarkController.deleteMark(request, response);

            expect(deleteMarkByIdSpy).toHaveBeenCalledWith(markId);
            expect(response.status).toHaveBeenCalledWith(404);
            expect(response.json).toHaveBeenCalledWith({ error: 'Mark not found' });
        });

        it('should handle errors and return a 500 status', async () => {
            const markId = 1;
            const originalConsoleError = console.error;
            console.error = jest.fn();
            const deleteMarkByIdSpy = jest.spyOn(MarkService, 'deleteMarkById').mockRejectedValue(new Error('Test Error'));

            const request = {
                params: { id: markId },
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await MarkController.deleteMark(request, response);

            expect(deleteMarkByIdSpy).toHaveBeenCalledWith(markId);
            expect(response.status).toHaveBeenCalledWith(500);
            expect(response.json).toHaveBeenCalledWith({ error: 'An error occurred while deleting the mark' });
        });
    });

})
