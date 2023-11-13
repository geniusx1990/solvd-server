const userService = require('../services/userService');
const bcrypt = require('bcryptjs');
const { createJwtToken } = require('../jwt/auth');
const { generateAccessToken } = require('../jwt/generateAccessToken')

class AuthController {
    async registration(request, response) {
        const { name, email, password, phonenumber, role } = request.body;
        try {
            const hash = bcrypt.hashSync(password, 5);
            const user = await userService.createUser(name, email, hash, phonenumber, role);
            return response.json({ message: 'user registered' });

        } catch (error) {
            console.log(error)
            response.status(400).json({ message: 'Registration error' })
        }
    }

    async login(request, response) {
        const { email, password } = request.body;

        try {
            const emailTaken = await userService.isEmailTaken(email)
            if (!emailTaken) {
                return response.status(400).json({ message: `The user with ${email} was not found.` })
            }
            const user = await userService.getUserByEmail(email);
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return response.status(400).json({ message: 'Incorrect password' })
            }
            const token = generateAccessToken(user.id, user.role);
            return response.json({ token });

        } catch (e) {
            console.log(e)
            response.status(400).json({ message: 'Login error' })
        }
    }
}

module.exports = new AuthController();
