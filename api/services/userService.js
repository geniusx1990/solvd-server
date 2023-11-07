const client = require('../configs/database');

class UserService {
    async getAllUsers() {
        try {
            const queryResult = await client.query('SELECT * FROM users ORDER BY id ASC');
            return queryResult.rows;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw new Error('An error occurred while fetching users.');
        }
    }

    async createUser(name, email, password, phonenumber, role) {
        try {
            const queryResult = await client.query(
                'INSERT INTO users (name, email, password, phonenumber, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [name, email, password, phonenumber, role]
            );

            const user = queryResult.rows[0];

            return user;
        } catch (error) {
            console.error('Error creating user:', error);
            throw new Error('An error occurred while creating a user.');
        }
    }

    async getUserById(userId) {
        try {
            const queryResult = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
            if (queryResult.rows.length === 0) {
                return null;
            }
            return queryResult.rows[0];
        } catch (error) {
            console.error("Error fetching user:", error);
            throw new Error('An error occurred while fetching the user.');


        }
    }

    async updateUser(id, name, email, password, phonenumber, role) {
        try {
            const queryResult = await client.query('UPDATE users SET name = $1, email = $2, password = $3, phonenumber = $4, role = $5 WHERE id = $6 RETURNING *', [name, email, password, phonenumber, role, id]);

            if (queryResult.rows.length === 0) {
                return null;
            }

            return queryResult.rows[0];
        } catch (error) {
            console.error('Error updating user:', error);
            throw new Error('An error occurred while updating the user.');
        }
    }

    async deleteUserById(userId) {
        try {
            const queryResult = await client.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);

            if (queryResult.rows.length === 0) {
                return null;
            }

            return queryResult.rows[0];
        } catch (error) {
            console.error('Error deleting user:', error);
            throw new Error('An error occurred while deleting the user');
        }
    }

    async isEmailTaken(email) {
        try {
            const queryResult = await client.query('SELECT EXISTS (SELECT 1 FROM users WHERE email = $1)', [email]);
            const emailTaken = queryResult.rows[0].exists;
            return (emailTaken)

        } catch (error) {
            console.error('Error deleting user:', error);
            throw new Error('An error occurred while deleting the user');
        }
    }

    async getUserByEmail(email) {
        try {
            const queryResult = await client.query('SELECT * FROM users WHERE email = $1', [email]);
            if (queryResult.rows.length === 0) {
                return null;
            }

            return queryResult.rows[0];
        } catch (error) {
            console.error("Error fetching user:", error);
            throw new Error('An error occurred while fetching the user.');


        }
    }

    async getUserByPhone(phonenumber) {
        try {
            const queryResult = await client.query('SELECT * FROM users WHERE phonenumber = $1', [phonenumber]);
            if (queryResult.rows.length === 0) {
                return null;
            }

            return queryResult.rows[0];
        } catch (error) {
            console.error("Error fetching user:", error);
            throw new Error('An error occurred while fetching the user.');


        }
    }




}
module.exports = new UserService();
