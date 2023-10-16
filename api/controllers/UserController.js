const client = require("../configs/database");
const UserService = require('../services/userService');

class UserController {
    async getUsers(request, response) {
        try {
            const users = await UserService.getAllUsers();
            response.status(200).json(users);
        } catch (e) {
            console.error("Error fetching users:", e);
            response.status(500).json({ e: "An error occurred while fetching users." });
        }
    }

    async createUser(request, response) {
        try {
            const { name, email, password, phonenumber, role } = request.body;
            const newUser = await UserService.createUser(name, email, password, phonenumber, role);
            response.status(201).json(newUser);
        } catch (error) {
            console.error('Error creating user:', error);
            response.status(500).json({ error: 'An error occurred while creating a user.' });
        }
    }

    async getUser(request, response) {
        const userId = request.params.id
        try {
            const user = await UserService.getUserById(userId);
            if (user === null) {
                response.status(404).json({ error: "User not found." });
            } else {
                response.status(200).json(user);
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            response.status(500).json({ error: "An error occurred while fetching the user." });
        }
    }


    async updateUser(request, response) {
        const user = request.body;
        const { id, name, email, password, phonenumber, role } = user;
        if (!id) {
            return response.status(400).json({ message: 'ID not specified' });
        }

        try {
            const updatedUser = await UserService.updateUser(id, name, email, password, phonenumber, role);
            if (updatedUser === null) {
                return response.status(404).json({ error: 'User not found' });
            }
            response.status(200).json(updatedUser);
        } catch (error) {
            return response.status(500).json({ error: 'An error occurred while updating the user' });
        }
    }

    async deleteUser(request, response) {
        const userId = request.params.id

        try {
            const deletedUser = await UserService.deleteUserById(userId);

            if (deletedUser === null) {
                return response.status(404).json({ error: 'User not found' });
            }
            response.status(200).json(deletedUser);

        } catch (error) {
            console.error('Error deleting user:', error);
            response.status(500).json({ error: 'An error occurred while deleting the user' });
        }
    }

}

module.exports = new UserController;