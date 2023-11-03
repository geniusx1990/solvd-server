const base64url = require('base64url');
const { calculateSignature } = require('./sha256');

function createJwtToken(payload, secret) {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };


  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));

  const signature = calculateSignature(encodedHeader + '.' + encodedPayload, secret)
  
  return encodedHeader + '.' + encodedPayload + '.' + signature;
}


module.exports = {
  createJwtToken,
};
