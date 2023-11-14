const httpMocks = require('node-mocks-http');
const {describe, it, expect} = require("@jest/globals");

const MarkController = require('./MarkController');
const MarkService = require('../services/markService');
const OrderPartsController = require("./OrderPartsController");

const mockFetchAllMarks = jest.spyOn(MarkService, 'getAllMarks');
const mockSaveMark = jest.spyOn(MarkService, 'createMark');
const mockGetMarkById = jest.spyOn(MarkService, 'getMarkById');
const mockUpdateMark = jest.spyOn(MarkService, 'updateMark');
const mockDeleteMark = jest.spyOn(MarkService, 'deleteMarkById');


describe('Mark Controller', function () {
    describe('GetAllMarks', function () {
        it('Should get data of marks', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();
            const mockMarksArray = [{
                "id": 4,
                "mark": "Audi"
            },
                {
                    "id": 5,
                    "mark": "BMW"
                }];

            const mockMarksList = jest.fn(async () => {
                return {marks: mockMarksArray};
            });

            mockFetchAllMarks.mockImplementation(mockMarksList);
            await MarkController.getMarks(request, response);
            expect(mockFetchAllMarks).toHaveBeenCalledTimes(1);
            expect(response.statusCode).toEqual(200);
            expect(response._isEndCalled()).toBeTruthy();
            expect(response._getJSONData().marks.length).toEqual(2);

        })

        it('should handle errors and return a 500 response', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();
            const mockError = new Error('An error occurred');
            const mockGetAllMarks = jest.fn(async () => {
                throw mockError;
            });
            mockFetchAllMarks.mockImplementation(mockGetAllMarks);

            const consoleErrorSpy = jest.spyOn(console, 'error');
            consoleErrorSpy.mockImplementation(() => {
            });

            await MarkController.getMarks(request, response);

            expect(mockGetAllMarks).toHaveBeenCalledTimes(1);
            expect(response.statusCode).toEqual(500);
            expect(response._isEndCalled()).toBeTruthy();
            expect(response._getJSONData()).toEqual({error: 'An error occurred while fetching marks.'});
            expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching marks:', mockError);
        });

    })


    describe('CreateMark', function () {
        it('should return 400 status for invalid input', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();
            request.body = {};

            const mockMarkEmpty = jest.fn(async () => {
                return {emptyMark: {}};
            });

            mockSaveMark.mockImplementation(mockMarkEmpty);
            await MarkController.createMark(request, response);
            expect(mockSaveMark).not.toHaveBeenCalled();
            expect(response.statusCode).toEqual(400);
            expect(response._isEndCalled()).toBeTruthy();
            expect(response._getJSONData().error).toEqual('Invalid input: mark is required');
        });

        it('should return a 409 status if mark already exists', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();

            const mockMarkExistTrue = jest.spyOn(MarkService, 'markExist').mockResolvedValue(true);

            request.body = {mark: 'Mercedes-Benz'};
            await MarkController.createMark(request, response);

            expect(response.statusCode).toEqual(409);
            expect(response._isEndCalled()).toBeTruthy();

            const responseData = response._getJSONData();
            expect(responseData.error).toEqual('Mark already exists');
        });

        it('should create a new mark and return 201 status', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();

            const mark = 'Mercedes-Benz';

            const markExistSpy = jest.spyOn(MarkService, 'markExist').mockResolvedValue(false);
            const createMarkSpy = jest.spyOn(MarkService, 'createMark').mockResolvedValue(mark);

            request.body = {
                mark: mark
            };

            await MarkController.createMark(request, response);

            expect(markExistSpy).toHaveBeenCalledWith(mark);
            expect(createMarkSpy).toHaveBeenCalledWith(mark);
            expect(response.statusCode).toBe(201);
            expect(response._isEndCalled()).toBeTruthy();
            expect(response._getJSONData()).toEqual({
                mark,
                message: 'Mark created successfully',
            });
        });

        it('should handle errors and return a 500 status', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();
            const mark = 'Mercedes-Benz';
            console.error = jest.fn();

            const markExistSpy = jest.spyOn(MarkService, 'markExist').mockRejectedValue(new Error('Test Error'));
            request.body = {
                mark: mark
            };

            await MarkController.createMark(request, response);

            expect(markExistSpy).toHaveBeenCalledWith(mark);
            expect(response.statusCode).toBe(500);
            expect(response._isEndCalled()).toBeTruthy();
            expect(response._getJSONData()).toEqual({
                error: 'An error occurred while creating a mark.',
            });
        });
    })


    describe('getMark', function () {
        it('should return a mark with 200 status if found', async () => {
            const request = httpMocks.createRequest();
            const response = httpMocks.createResponse();

            const mockMark = {id: 1, mark: 'Audi'};
            const mockOneMark = jest.fn(async () => {
                return mockMark;
            });

            mockGetMarkById.mockImplementation(mockOneMark);

            request.params.id = 1;

            await MarkController.getMark(request, response);

            expect(response.statusCode).toEqual(200);
            expect(response._isEndCalled()).toBeTruthy();

            const responseData = response._getJSONData();
            expect(responseData).toEqual(mockMark);
        });

        it('should return 404 status if mark not found', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();
            request.params = {id: 999};

            mockGetMarkById.mockResolvedValue(null);

            await MarkController.getMark(request, response);

            expect(mockGetMarkById).toHaveBeenCalledWith(999);
            expect(response.statusCode).toEqual(404);
            expect(response._isEndCalled()).toBeTruthy();
            expect(response._getJSONData()).toEqual({error: 'Mark not found.'});
        });

        it('should handle errors and return a 500 status', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();
            request.params = {id: 2};

            const errorMock = new Error('Test error');

            mockGetMarkById.mockRejectedValue(errorMock);
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
            });

            await MarkController.getMark(request, response);

            expect(mockGetMarkById).toHaveBeenCalledWith(2);
            expect(response.statusCode).toEqual(500);
            expect(response._isEndCalled()).toBeTruthy();
            expect(response._getJSONData()).toEqual({error: 'An error occurred while fetching the mark.'});
        });
    });

    describe('updateMark', function () {
        it('should update a mark and return 200 status', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();

            const markData = {id: 1, mark: 'KIA'};
            mockUpdateMark.mockResolvedValue(markData);

            request.body = {
                id: 1, mark: 'KIA'
            };

            await MarkController.updateMark(request, response);

            expect(mockUpdateMark).toHaveBeenCalledWith(markData.id, markData.mark);
            expect(response.statusCode).toEqual(200);
            expect(response._isEndCalled()).toBeTruthy();
            expect(response._getJSONData()).toEqual({message: 'Mark updated successfully', updatedMark: markData});
        });

        it('should return 404 status if mark not found', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();
            const markData = {id: 1, mark: 'KIA'};

            mockUpdateMark.mockResolvedValue(null);

            request.body = {
                id: 1, mark: 'KIA'
            };

            await MarkController.updateMark(request, response);

            expect(mockUpdateMark).toHaveBeenCalledWith(markData.id, markData.mark);
            expect(response.statusCode).toBe(404);
            expect(response._isEndCalled()).toBeTruthy();
            expect(response._getJSONData()).toEqual({error: 'Mark not found'});
        });

        it('should return 400 status if ID not specified', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();
            request.body = {};

            await MarkController.updateMark(request, response);

            expect(response.statusCode).toBe(400);
            expect(response._isEndCalled()).toBeTruthy();
            expect(response._getJSONData()).toEqual({message: 'ID not specified'});
        });

        it('should handle errors and return a 500 status', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();

            const errorMessage = 'Internal server error';
            const mockError = new Error(errorMessage);

            const mockUpdateMarkError = jest.fn(async () => {
                throw mockError;
            });

            mockUpdateMark.mockImplementation(mockUpdateMarkError);

            request.body = {
                id: 1, mark: 'KIA'
            };

            await MarkController.updateMark(request, response);
            expect(response.statusCode).toEqual(500);
            expect(response._isEndCalled()).toBeTruthy();
            const responseData = response._getJSONData();
            expect(responseData.error).toEqual('An error occurred while updating the mark');
        });
    });

    describe('deleteMark', function () {
        it('should delete a mark and return 200 status if found', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();

            const deletedMark = {id: 1, mark: 'Audi'};
            mockDeleteMark.mockResolvedValue(deletedMark);

            request.params = {id: 1};
            await MarkController.deleteMark(request, response);

            expect(response.statusCode).toEqual(200);
            expect(response._isEndCalled()).toBeTruthy();

            const responseData = response._getJSONData();
            expect(responseData.message).toEqual('Mark deleted successfully');
            expect(responseData.deletedMark).toEqual(deletedMark);
        });

        it('should return 404 status if mark not found', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();

            mockDeleteMark.mockResolvedValue(null);

            request.params = {id: 1};
            await MarkController.deleteMark(request, response);

            expect(response.statusCode).toEqual(404);
            expect(response._isEndCalled()).toBeTruthy();

            const responseData = response._getJSONData();
            expect(responseData.error).toEqual('Mark not found');
        });

        it('should handle errors and return a 500 status', async () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();

            const errorMock = new Error('Test error');
            mockDeleteMark.mockRejectedValue(errorMock);
            jest.spyOn(console, 'error').mockImplementation(() => {
            });

            request.params = {id: 1};
            await MarkController.deleteMark(request, response);

            expect(response.statusCode).toEqual(500);
            expect(response._isEndCalled()).toBeTruthy();

            const responseData = response._getJSONData();
            expect(responseData.error).toEqual('An error occurred while deleting the mark');
        });
    });

})
