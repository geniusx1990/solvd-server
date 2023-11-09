const bcrypt = require('bcryptjs');
const httpMocks = require('node-mocks-http');
const AuthController = require('./authController');
const UserService = require('../services/userService');

jest.mock('../services/userService');
const mockCreateUser = jest.spyOn(UserService, 'createUser');
const mockIsEmailTaken = jest.spyOn(UserService, 'isEmailTaken');
const mockGetUserByEmail = jest.spyOn(UserService, 'getUserByEmail');


describe('registration', () => {
    it('should register user', async () => {
        const response = httpMocks.createResponse();
        const request = httpMocks.createRequest();

        request.body = {
            name: 'Alex',
            email: 'alex@gmail.com',
            password: 'password123',
            phonenumber: '1234567890',
            role: 'user',
        };

        const bcryptHashSyncMock = jest.spyOn(bcrypt, 'hashSync');
        bcryptHashSyncMock.mockReturnValue('hashed_password');

        const createUserMock = jest.fn(async () => ({
            name: request.body.name,
            email: request.body.email,
            password: 'hashed_password',
            phonenumber: request.body.phonenumber,
            role: request.body.role,
        }));

        mockCreateUser.mockImplementation(createUserMock);

        await AuthController.registration(request, response);

        expect(createUserMock).toHaveBeenCalledWith(
            request.body.name,
            request.body.email,
            'hashed_password',
            request.body.phonenumber,
            request.body.role
        );

        expect(bcryptHashSyncMock).toHaveBeenCalledWith(request.body.password, 5);
        expect(response.statusCode).toBe(200);
        expect(response._getJSONData()).toEqual({message: 'user registered'});
    });
});


describe('login', () => {


    it('should return 400 and a message about the absence of a user', async () => {
        const response = httpMocks.createResponse();
        const request = httpMocks.createRequest();

        const email = 'nonexistent@gmail.com';

        mockIsEmailTaken.mockResolvedValue(false);
        request.body = {
            email,
            password: 'password123',
        };

        await AuthController.login(request, response);

        expect(mockIsEmailTaken).toHaveBeenCalledWith(email);

        expect(response.statusCode).toBe(400);
        expect(response._getJSONData()).toEqual({ message: `The user with ${email} was not found.` });
    });

    it('should return 400 and an invalid password message', async () => {
        const response = httpMocks.createResponse();
        const request = httpMocks.createRequest();

        const email = 'alex@gmail.com';

        mockIsEmailTaken.mockResolvedValue(true);
        mockGetUserByEmail.mockResolvedValue({
            id: 1,
            email,
            password: bcrypt.hashSync('password123', 5),
            role: 'user',
        });

        request.body = {
            email,
            password: 'incorrect_password',
        };

        await AuthController.login(request, response);

        expect(mockIsEmailTaken).toHaveBeenCalledWith(email);
        expect(mockGetUserByEmail).toHaveBeenCalledWith(email);

        expect(response.statusCode).toBe(400);
        expect(response._getJSONData()).toEqual({ message: 'Incorrect password' });
    });
});
