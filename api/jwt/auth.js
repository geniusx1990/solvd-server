const base64url = require('base64url');
const crypto = require('crypto');

function createJwtToken(payload, secret) {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));


  const signature = crypto.createHmac('sha256', secret).update(encodedHeader + '.' + encodedPayload).digest('base64');

  return encodedHeader + '.' + encodedPayload + '.' + base64url.fromBase64(signature);
}



module.exports = {
  createJwtToken,
};
