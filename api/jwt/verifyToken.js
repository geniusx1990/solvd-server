const base64url = require('base64url');
const crypto = require('crypto');

function verifyJwtToken(token, secret) {
  const [headerEncoded, payloadEncoded, signature] = token.split('.');

  const header = JSON.parse(base64url.decode(headerEncoded));
  const payload = JSON.parse(base64url.decode(payloadEncoded));

  const computedSignature = crypto
    .createHmac('sha256', secret)
    .update(headerEncoded + '.' + payloadEncoded)
    .digest('base64').replace(/\+/g, '-').replace(/\//g, '_').slice(0, -1);

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