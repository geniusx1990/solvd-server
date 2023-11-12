const UserService = require('./userService');
const {describe, it, expect} = require("@jest/globals");

const client = require('../configs/database');

jest.mock('../configs/database');


describe('User Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('Get all Users', () => {
        it('should fetch all users from the database', async () => {
            const queryMock = jest.spyOn(client, 'query');
            queryMock.mockResolvedValueOnce({rows: [{id: 1, name: 'User 1'}, {id: 2, name: 'User 2'}]});

            const result = await UserService.getAllUsers();

            expect(queryMock).toHaveBeenCalledWith('SELECT * FROM users ORDER BY id ASC');
            expect(result).toEqual([{id: 1, name: 'User 1'}, {id: 2, name: 'User 2'}]);
        });
    });

    describe('Create User', () => {
        it('should create a new user in the database', async () => {
            const queryMock = jest.spyOn(client, 'query');
            queryMock.mockResolvedValueOnce({
                rows: [{
                    id: 1,
                    name: 'Ivan',
                    email: 'ivan@gmail.com',
                    password: 'ivanpassword',
                    phonenumber: '12345678',
                    role: 'user'
                }]
            });

            const result = await UserService.createUser('Ivan', 'ivan@gmail.com', 'ivanpassword', '12345678', 'user');

            expect(queryMock).toHaveBeenCalledWith(
                'INSERT INTO users (name, email, password, phonenumber, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                ['Ivan', 'ivan@gmail.com', 'ivanpassword', '12345678', 'user']
            );

            expect(result).toEqual({
                id: 1,
                name: 'Ivan',
                email: 'ivan@gmail.com',
                password: 'ivanpassword',
                phonenumber: '12345678',
                role: 'user'
            });
        });
    });

    describe('Get User By Id', () => {

        it('should get a user by ID from the database', async () => {
            const userId = 1;
            const expectedUser = {
                id: 1,
                name: 'Alex',
                email: 'john@gmail.com',
                password: 'password123',
                phonenumber: '1234567890',
                role: 'User'
            };

            const queryMock = jest.spyOn(client, 'query');
            queryMock.mockResolvedValueOnce({rows: [expectedUser]});

            const result = await UserService.getUserById(userId);

            expect(queryMock).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', [userId]);
            expect(result).toEqual(expectedUser);
        });

        it('should return null if user is not found', async () => {
            const userId = 999;
            const queryMock = jest.spyOn(client, 'query');
            queryMock.mockResolvedValueOnce({rows: []});

            const result = await UserService.getUserById(userId);

            expect(queryMock).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', [userId]);
            expect(result).toBeNull();
        });

        it('should handle database error', async () => {
            const userId = 1;
            const queryMock = jest.spyOn(client, 'query');
            queryMock.mockRejectedValueOnce(new Error('Database error'));

            jest.spyOn(console, 'error').mockImplementation(() => {
            });

            await expect(UserService.getUserById(userId)).rejects.toThrow('An error occurred while fetching the user.');
        });

    });

    describe('Update User', () => {

        it('should update a user in the database', async () => {
            const userId = 1;
            const updatedUser = {
                id: userId,
                name: 'Alex',
                email: 'alex@gmail.com',
                password: 'alexpassword',
                phonenumber: '9876543210',
                role: 'Admin'
            };

            const queryMock = jest.spyOn(client, 'query');
            queryMock.mockResolvedValueOnce({rows: [updatedUser]});

            const result = await UserService.updateUser(userId, 'Alex', 'alex@gmail.com', 'alexpassword', '9876543210', 'Admin');

            expect(queryMock).toHaveBeenCalledWith(
                'UPDATE users SET name = $1, email = $2, password = $3, phonenumber = $4, role = $5 WHERE id = $6 RETURNING *',
                ['Alex', 'alex@gmail.com', 'alexpassword', '9876543210', 'Admin', userId]
            );
            expect(result).toEqual(updatedUser);
        });

        it('should return null if user is not found', async () => {
            const userId = 999;
            const queryMock = jest.spyOn(client, 'query');
            queryMock.mockResolvedValueOnce({rows: []});

            const result = await UserService.updateUser(userId, 'Alex', 'alex@gmail.com', 'alexpassword', '9876543210', 'Admin');

            expect(queryMock).toHaveBeenCalledWith(
                'UPDATE users SET name = $1, email = $2, password = $3, phonenumber = $4, role = $5 WHERE id = $6 RETURNING *',
                ['Alex', 'alex@gmail.com', 'alexpassword', '9876543210', 'Admin', userId]
            );
            expect(result).toBeNull();
        });

        it('should handle database error', async () => {
            const userId = 1;
            const queryMock = jest.spyOn(client, 'query');
            queryMock.mockRejectedValueOnce(new Error('Database error'));

            jest.spyOn(console, 'error').mockImplementation(() => {
            });

            await expect(UserService.updateUser(userId, 'Alex', 'alex@gmail.com', 'alexpassword', '9876543210', 'Admin')).rejects.toThrow('An error occurred while updating the user.');
        });
    });


    describe('Delete user by ID', () => {

        it('should delete a user from the database', async () => {
            const userId = 1;
            const deletedUser = {
                id: userId,
                name: 'Alex',
                email: 'alex@gmail.com',
                password: 'alexpassword',
                phonenumber: '9876543210',
                role: 'Admin'
            };

            const queryMock = jest.spyOn(client, 'query');
            queryMock.mockResolvedValueOnce({rows: [deletedUser]});

            const result = await UserService.deleteUserById(userId);

            expect(queryMock).toHaveBeenCalledWith('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);
            expect(result).toEqual(deletedUser);
        });

        it('should return null if user is not found during deletion', async () => {
            const userId = 999;
            const queryMock = jest.spyOn(client, 'query');
            queryMock.mockResolvedValueOnce({rows: []});

            const result = await UserService.deleteUserById(userId);

            expect(queryMock).toHaveBeenCalledWith('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);
            expect(result).toBeNull();
        });

        it('should handle database error during deletion', async () => {
            const userId = 1;
            const queryMock = jest.spyOn(client, 'query');
            queryMock.mockRejectedValueOnce(new Error('Database error'));

            jest.spyOn(console, 'error').mockImplementation(() => {
            });

            await expect(UserService.deleteUserById(userId)).rejects.toThrow('An error occurred while deleting the user');
        });
    });


    describe('is email taken', () => {

        it('should return true if email is taken', async () => {
            const email = 'alex@gmail.com';
            const queryMock = jest.spyOn(client, 'query');
            queryMock.mockResolvedValueOnce({rows: [{exists: true}]});

            const result = await UserService.isEmailTaken(email);

            expect(queryMock).toHaveBeenCalledWith('SELECT EXISTS (SELECT 1 FROM users WHERE email = $1)', [email]);
            expect(result).toBe(true);
        });

        it('should return false if email is not taken', async () => {
            const email = 'andrea@gmail.com';
            const queryMock = jest.spyOn(client, 'query');
            queryMock.mockResolvedValueOnce({rows: [{exists: false}]});

            const result = await UserService.isEmailTaken(email);

            expect(queryMock).toHaveBeenCalledWith('SELECT EXISTS (SELECT 1 FROM users WHERE email = $1)', [email]);
            expect(result).toBe(false);
        });

        it('should handle database error during email check', async () => {
            const email = 'error@example.com';
            const queryMock = jest.spyOn(client, 'query');
            queryMock.mockRejectedValueOnce(new Error('Database error'));

            jest.spyOn(console, 'error').mockImplementation(() => {
            });

            await expect(UserService.isEmailTaken(email)).rejects.toThrow('An error occurred while deleting the user');
        });
    });

    describe('Get user by phone number', () => {

        it('should return the user if phone number exists', async () => {
            const phoneNumber = '1234567890';
            const expectedUser = {
                id: 1,
                name: 'Alex',
                email: 'alex@gmail.com',
                password: 'alexpassword',
                phonenumber: phoneNumber,
                role: 'User'
            };

            const queryMock = jest.spyOn(client, 'query');
            queryMock.mockResolvedValueOnce({rows: [expectedUser]});

            const result = await UserService.getUserByPhone(phoneNumber);

            expect(queryMock).toHaveBeenCalledWith('SELECT * FROM users WHERE phonenumber = $1', [phoneNumber]);
            expect(result).toEqual(expectedUser);
        });

        it('should return null if phone number does not exist', async () => {
            const phoneNumber = '0000000';
            const queryMock = jest.spyOn(client, 'query');
            queryMock.mockResolvedValueOnce({rows: []});

            const result = await UserService.getUserByPhone(phoneNumber);

            expect(queryMock).toHaveBeenCalledWith('SELECT * FROM users WHERE phonenumber = $1', [phoneNumber]);
            expect(result).toBeNull();
        });

        it('should handle database error during phone number check', async () => {
            const phoneNumber = '1234567890';
            const queryMock = jest.spyOn(client, 'query');
            queryMock.mockRejectedValueOnce(new Error('Database error'));

            jest.spyOn(console, 'error').mockImplementation(() => {
            });

            await expect(UserService.getUserByPhone(phoneNumber)).rejects.toThrow('An error occurred while fetching the user.');
        });
    });

});

