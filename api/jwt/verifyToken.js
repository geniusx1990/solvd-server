const base64url = require('base64url');
const { calculateSignature } = require('./sha256');

function verifyJwtToken(token, secret) {
  const [headerEncoded, payloadEncoded, signature] = token.split('.');

  const header = JSON.parse(base64url.decode(headerEncoded));
  const payload = JSON.parse(base64url.decode(payloadEncoded));

  const computedSignature = calculateSignature(headerEncoded + '.' + payloadEncoded, secret)

  if (computedSignature !== signature) {
    throw new Error('Invalid token signature');
  }

  const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < currentTimeInSeconds) {
    throw new Error('Token has expired');
  }

  if (payload.iat && payload.iat > currentTimeInSeconds) {
    throw new Error('Token is not yet valid');
  }

  return payload;
}

module.exports = {
  verifyJwtToken,
}