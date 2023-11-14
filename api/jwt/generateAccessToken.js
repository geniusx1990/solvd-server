const {createJwtToken} = require("./auth");
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
    return createJwtToken(payload, process.env.SECRET)
}

module.exports = {
    generateAccessToken,
}
