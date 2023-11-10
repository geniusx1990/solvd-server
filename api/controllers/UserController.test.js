const {describe, it, expect} = require("@jest/globals");

const UserController = require('./UserController');
const UserService = require('../services/userService');

describe('User Controller', function () {
    describe('getUsers', function () {
        it('should return a list of users with 200 status if successful', async () => {
            const mockUsers = [
                { id: 1, name: 'User 1' },
                { id: 2, name: 'User 2' },
            ];

            const getAllUsersSpy = jest.spyOn(UserService, 'getAllUsers').mockResolvedValue(mockUsers);

            const request = {};
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await UserController.getUsers(request, response);

            expect(getAllUsersSpy).toHaveBeenCalled();
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(mockUsers);
        });

        it('should handle errors and return a 500 status', async () => {
            const originalConsoleError = console.error;
            console.error = jest.fn();

            const getAllUsersSpy = jest.spyOn(UserService, 'getAllUsers').mockRejectedValue(new Error('Test Error'));

            const request = {};
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await UserController.getUsers(request, response);

            expect(getAllUsersSpy).toHaveBeenCalled();
            expect(response.status).toHaveBeenCalledWith(500);
            expect(response.json).toHaveBeenCalledWith({ error: 'An error occurred while fetching users.' });
        });
    });


    describe('createUser', function () {
        it('should create a new user and return 201 status if successful', async () => {
            const userData = {
                name: 'Alex',
                email: 'alex@gmail.com',
                password: 'alexpassword',
                phonenumber: '1234567890',
                role: 'user',
            };

            const getUserByEmailSpy = jest.spyOn(UserService, 'getUserByEmail').mockResolvedValue(null);
            const getUserByPhoneSpy = jest.spyOn(UserService, 'getUserByPhone').mockResolvedValue(null);
            const createUserSpy = jest.spyOn(UserService, 'createUser').mockResolvedValue(userData);

            const request = {
                body: userData,
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await UserController.createUser(request, response);

            expect(getUserByEmailSpy).toHaveBeenCalledWith(userData.email);
            expect(getUserByPhoneSpy).toHaveBeenCalledWith(userData.phonenumber);
            expect(createUserSpy).toHaveBeenCalledWith(
                userData.name,
                userData.email,
                userData.password,
                userData.phonenumber,
                userData.role
            );
            expect(response.status).toHaveBeenCalledWith(201);
            expect(response.json).toHaveBeenCalledWith(userData);
        });

        it('should return 400 status for invalid user data', async () => {
            const invalidUserData = {
                name: 'Alex',
                email: 'alex@gmail.com',
                password: 'alexpassword',
                phonenumber: '1234567890',
            };

            const request = {
                body: invalidUserData,
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await UserController.createUser(request, response);

            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({
                error: 'Invalid user data. Please check the request data and try again.',
            });
        });

        it('should return 400 status if user with the same email already exists', async () => {
            const existingUserEmail = 'alex@gmail.com';

            const getUserByEmailSpy = jest.spyOn(UserService, 'getUserByEmail').mockResolvedValue(existingUserEmail);

            const userData = {
                name: 'Alex',
                email: existingUserEmail,
                password: 'alexpassword',
                phonenumber: '1234567890',
                role: 'user',
            };

            const request = {
                body: userData,
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await UserController.createUser(request, response);

            expect(getUserByEmailSpy).toHaveBeenCalledWith(existingUserEmail);
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({
                error: 'User with the same email already exists',
            });
        });

        it('should return 400 status if user with the same phonenumber already exists', async () => {
            const existingUserPhonenumber = '1234567890';

            const getUserByEmailSpy = jest.spyOn(UserService, 'getUserByEmail').mockResolvedValue(null);
            const getUserByPhoneSpy = jest.spyOn(UserService, 'getUserByPhone').mockResolvedValue(existingUserPhonenumber);

            const userData = {
                name: 'Alex',
                email: 'alex@gmail.com',
                password: 'alexpassword',
                phonenumber: existingUserPhonenumber,
                role: 'user',
            };

            const request = {
                body: userData,
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await UserController.createUser(request, response);

            expect(getUserByPhoneSpy).toHaveBeenCalledWith(existingUserPhonenumber);
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({
                error: 'User with the same phonenumber already exists',
            });
        });

        it('should handle errors and return a 500 status', async () => {
            const originalConsoleError = console.error;
            console.error = jest.fn();

            const userData = {
                name: 'Alex',
                email: 'alex@gmail.com',
                password: 'alexpassword',
                phonenumber: '1234567890',
                role: 'user',
            };

            const getUserByEmailSpy = jest.spyOn(UserService, 'getUserByEmail').mockRejectedValue(new Error('Test Error'));
            const getUserByPhoneSpy = jest.spyOn(UserService, 'getUserByPhone').mockRejectedValue(new Error('Test Error'));
            const createUserSpy = jest.spyOn(UserService, 'createUser').mockRejectedValue(new Error('Test Error'));

            const request = {
                body: userData,
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await UserController.createUser(request, response);

            expect(getUserByEmailSpy).toHaveBeenCalledWith(userData.email);
            expect(getUserByPhoneSpy).toHaveBeenCalledWith(userData.phonenumber);
            expect(createUserSpy).toHaveBeenCalledWith(
                userData.name,
                userData.email,
                userData.password,
                userData.phonenumber,
                userData.role
            );
            expect(response.status).toHaveBeenCalledWith(500);
            expect(response.json).toHaveBeenCalledWith({
                error: 'An error occurred while creating a user.',
            });
        });
    });

    describe('getUser', function () {
        it('should return a user with 200 status if ID is valid and user is found', async () => {
            const userId = 1;
            const mockUser = { id: userId, name: 'Test User' };
            const getUserByIdSpy = jest.spyOn(UserService, 'getUserById').mockResolvedValue(mockUser);

            const request = {
                params: { id: userId },
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await UserController.getUser(request, response);

            expect(getUserByIdSpy).toHaveBeenCalledWith(userId);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(mockUser);
        });

        it('should return 400 status for invalid user ID', async () => {
            const invalidUserId = 'invalid';

            const request = {
                params: { id: invalidUserId },
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await UserController.getUser(request, response);

            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({ error: 'Invalid User ID. User ID must be a number.' });
        });

        it('should return 404 status if user is not found', async () => {
            const userId = 1;
            const getUserByIdSpy = jest.spyOn(UserService, 'getUserById').mockResolvedValue(null);

            const request = {
                params: { id: userId },
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await UserController.getUser(request, response);

            expect(getUserByIdSpy).toHaveBeenCalledWith(userId);
            expect(response.status).toHaveBeenCalledWith(404);
            expect(response.json).toHaveBeenCalledWith({ error: 'User not found.' });
        });

        it('should return 400 status if ID is not specified', async () => {
            const request = {
                params: {},
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await UserController.getUser(request, response);

            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({ message: 'ID not specified' });
        });

        it('should handle errors and return a 500 status', async () => {
            const originalConsoleError = console.error;
            console.error = jest.fn();

            const userId = 1;
            const getUserByIdSpy = jest.spyOn(UserService, 'getUserById').mockRejectedValue(new Error('Test Error'));

            const request = {
                params: { id: userId },
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await UserController.getUser(request, response);

            expect(getUserByIdSpy).toHaveBeenCalledWith(userId);
            expect(response.status).toHaveBeenCalledWith(500);
            expect(response.json).toHaveBeenCalledWith({ error: 'An error occurred while fetching the user.' });
        });
    });

    describe('updateUser', function () {
        it('should update a user and return 200 status if found', async () => {
            const userData = {
                id: 1,
                name: 'Ivan',
                email: 'ivan@gmail.com',
                password: 'ivanpassword',
                phonenumber: '9876543210',
                role: 'user',
            };

            const updateUserSpy = jest.spyOn(UserService, 'updateUser').mockResolvedValue(userData);

            const request = {
                body: userData,
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await UserController.updateUser(request, response);

            expect(updateUserSpy).toHaveBeenCalledWith(
                userData.id,
                userData.name,
                userData.email,
                userData.password,
                userData.phonenumber,
                userData.role
            );
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith({
                message: 'User successfully updated',
                updatedUser: userData,
            });
        });

        it('should return 400 status if ID is not specified', async () => {
            const userData = {
                name: 'Ivan',
                email: 'ivan@example.com',
                password: 'updatedPassword',
                phonenumber: '9876543210',
                role: 'user',
            };

            const request = {
                body: userData,
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await UserController.updateUser(request, response);

            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({ message: 'ID not specified' });
        });

        it('should return 400 status if phonenumber is not a number', async () => {
            const userData = {
                id: 1,
                name: 'Updated User',
                email: 'ivan@gmail.com',
                password: 'ivanpassword',
                phonenumber: 'invalidPhonenumber',
                role: 'user',
            };

            const request = {
                body: userData,
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await UserController.updateUser(request, response);

            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({ message: 'Please use number for phonenumber' });
        });

        it('should return 404 status if user is not found', async () => {
            const userData = {
                id: 1,
                name: 'Ivan',
                email: 'ivan@gmail.com',
                password: 'ivanpassword',
                phonenumber: '9876543210',
                role: 'user',
            };

            const updateUserSpy = jest.spyOn(UserService, 'updateUser').mockResolvedValue(null);

            const request = {
                body: userData,
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await UserController.updateUser(request, response);

            expect(updateUserSpy).toHaveBeenCalledWith(
                userData.id,
                userData.name,
                userData.email,
                userData.password,
                userData.phonenumber,
                userData.role
            );
            expect(response.status).toHaveBeenCalledWith(404);
            expect(response.json).toHaveBeenCalledWith({ error: 'User not found' });
        });

        it('should handle errors and return a 500 status', async () => {
            const originalConsoleError = console.error;
            console.error = jest.fn();

            const userData = {
                id: 1,
                name: 'Ivan',
                email: 'ivan@gmail.com',
                password: 'ivanpassword',
                phonenumber: '9876543210',
                role: 'user',
            };

            const updateUserSpy = jest.spyOn(UserService, 'updateUser').mockRejectedValue(new Error('Test Error'));

            const request = {
                body: userData,
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await UserController.updateUser(request, response);

            expect(updateUserSpy).toHaveBeenCalledWith(
                userData.id,
                userData.name,
                userData.email,
                userData.password,
                userData.phonenumber,
                userData.role
            );
            expect(response.status).toHaveBeenCalledWith(500);
            expect(response.json).toHaveBeenCalledWith({ error: 'An error occurred while updating the user' });
        });
    });

    describe('deleteUser', function () {
        it('should delete a user and return 200 status if found', async () => {
            const userId = 1;
            const mockUser = { id: userId, name: 'Test User' };

            const deleteUserByIdSpy = jest.spyOn(UserService, 'deleteUserById').mockResolvedValue(mockUser);

            const request = {
                params: { id: userId },
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await UserController.deleteUser(request, response);

            expect(deleteUserByIdSpy).toHaveBeenCalledWith(userId);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith({
                message: 'User successfully deleted',
                deletedUser: mockUser,
            });
        });

        it('should return 404 status if user is not found', async () => {
            const userId = 1;

            const deleteUserByIdSpy = jest.spyOn(UserService, 'deleteUserById').mockResolvedValue(null);

            const request = {
                params: { id: userId },
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await UserController.deleteUser(request, response);

            expect(deleteUserByIdSpy).toHaveBeenCalledWith(userId);
            expect(response.status).toHaveBeenCalledWith(404);
            expect(response.json).toHaveBeenCalledWith({ error: 'User not found' });
        });

        it('should return 400 status if ID is not specified', async () => {
            const request = {
                params: {},
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await UserController.deleteUser(request, response);

            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({ message: 'ID not specified' });
        });

        it('should handle errors and return a 500 status', async () => {
            const originalConsoleError = console.error;
            console.error = jest.fn();

            const userId = 1;

            const deleteUserByIdSpy = jest.spyOn(UserService, 'deleteUserById').mockRejectedValue(new Error('Test Error'));

            const request = {
                params: { id: userId },
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await UserController.deleteUser(request, response);

            expect(deleteUserByIdSpy).toHaveBeenCalledWith(userId);
            expect(response.status).toHaveBeenCalledWith(500);
            expect(response.json).toHaveBeenCalledWith({ error: 'An error occurred while deleting the user' });
        });
    });

});
