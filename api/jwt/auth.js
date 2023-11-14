const base64url = require('base64url');
const { calculateSignature } = require('./sha256');
const { base64urlEncode } = require('./base64UrlEncode');
function createJwtToken(payload, secret) {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };


  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedPayload = base64urlEncode(JSON.stringify(payload));

  const signature = calculateSignature(encodedHeader + '.' + encodedPayload, secret)

  return encodedHeader + '.' + encodedPayload + '.' + signature;
}


module.exports = {
  createJwtToken,
};
