const UserService = require('../services/userService');

class UserController {
    async getUsers(request, response) {
        try {
            const users = await UserService.getAllUsers();
            response.status(200).json(users);
        } catch (error) {
            console.error("Error fetching users:", error);
            response.status(500).json({ error: "An error occurred while fetching users." });
        }
    }

    async createUser(request, response) {
        const { name, email, password, phonenumber, role } = request.body;

        if (!name || !email || !password || !phonenumber || isNaN(phonenumber) || !role) {
            return response.status(400).json({ error: "Invalid user data. Please check the request data and try again." });
        }

        try {
            const existingUser = await UserService.getUserByEmail(email);
            if (existingUser) {
                return response.status(400).json({ error: 'User with the same email already exists' });
            }

            const existingUserWithPhonenumber = await UserService.getUserByPhone(phonenumber);
            if (existingUserWithPhonenumber) {
                return response.status(400).json({ error: 'User with the same phonenumber already exists' });
            }

            const newUser = await UserService.createUser(name, email, password, phonenumber, role);
            response.status(201).json(newUser);
            
        } catch (error) {
            console.error('Error creating user:', error);
            response.status(500).json({ error: 'An error occurred while creating a user.' });
        }
    }

    async getUser(request, response) {
        const userId = request.params.id

        if (!userId) {
            return response.status(400).json({ message: 'ID not specified' });
        }

        if (isNaN(userId)) {
            response.status(400).json({ error: "Invalid User ID. User ID must be a number." });
            return;
        }
        
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
        if (!id || isNaN(id)) {
            return response.status(400).json({ message: 'ID not specified' });
        }

        if (isNaN(phonenumber)) {
            return response.status(400).json({ message: 'Please use number for phonenumber' });
        }

        try {
            const updatedUser = await UserService.updateUser(id, name, email, password, phonenumber, role);
            if (updatedUser === null) {
                return response.status(404).json({ error: 'User not found' });
            }
            return response.status(200).json({ message: 'User successfully updated', updatedUser });
        } catch (error) {
            return response.status(500).json({ error: "An error occurred while updating the user" });
        }
    }

    async deleteUser(request, response) {
        const userId = request.params.id

        if (!userId) {
            return response.status(400).json({ message: 'ID not specified' });
        }

        try {
            const deletedUser = await UserService.deleteUserById(userId);

            if (deletedUser === null) {
                return response.status(404).json({ error: 'User not found' });
            }
            return response.status(200).json({ message: 'User successfully deleted', deletedUser });

        } catch (error) {
            console.error('Error deleting user:', error);
            response.status(500).json({ error: 'An error occurred while deleting the user' });
        }
    }

}

module.exports = new UserController;