const { verifyJwtToken } = require('../jwt/verifyToken');

module.exports = function (request, response, next) {
    if (request.method === "OPTIONS") {
        next();
    }

    try {
        const token = request.headers.authorization.split(' ')[1];
        console.log(token)
        if (!token) {
            return response.status(403).json({ message: 'User is not authorized' });
        }

        try {
            const decodedData = verifyJwtToken(token, process.env.SECRET);
            request.user = decodedData;
            console.log('Decoded Data:', decodedData.role);

            next();
          } catch (error) {
            console.error('Token verification failed:', error.message);
            return response.status(403).json({ message: 'User is not authorized' });
          } 
    } catch (e) {
        console.log(e);
        return response.status(403).json({ message: 'User is not authorized' });
    }
}