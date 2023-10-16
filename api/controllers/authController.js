const userService = require('../services/userService');
const UserController = require('./UserController');
const bcrypt = require('bcryptjs');
const { secret } = require('../configs/config');
const { createJwtToken } = require('../jwt/auth');
const generateAccessToken = (id, role) => {
    const expirationInSeconds = 86400;
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const expirationTimeInSeconds = currentTimeInSeconds + expirationInSeconds;
    const payload = {
        sub: id,
        role: role,
        iat: currentTimeInSeconds,
        exp: expirationTimeInSeconds,
    };
    return createJwtToken(payload, secret)
}
class AuthController {
    async registration(request, response) {
        try {
            const { name, email, password, phonenumber, role } = request.body;

            const hash = bcrypt.hashSync(password, 5);


            const emailTaken = await userService.isEmailTaken(email)
            if (emailTaken) {
                return response.status(400).json({ message: 'Email is already taken, please use another email' })
            }
            //TODO add table roles and find role in this table
            const user = await userService.createUser(name, email, hash, phonenumber, role);

            return response.json({ message: 'user registered' });
        } catch (e) {
            console.log(e)
            response.status(400).json({ message: 'Registration error' })
        }
    }



    async login(request, response) {
        try {
            const { email, password } = request.body;
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
            /* else {
                console.log('passsword OK')
            } */

        } catch (e) {
            console.log(e)
            response.status(400).json({ message: 'Login error' })
        }
    }
}

module.exports = new AuthController();