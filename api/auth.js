const base64url = require('base64url');
const crypto = require('crypto');

const secretKey = 'your-secret-key'; // Замените на ваш секретный ключ

function createJwtToken(payload) {
  // Заголовок токена
  const header = {
    alg: 'HS256', // Алгоритм шифрования (HMAC-SHA256)
    typ: 'JWT',
  };

  // Шифрование заголовка и данных в формате Base64 URL-safe
  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));

  // Создание подписи токена
  const signature = crypto.createHmac('sha256', secretKey).update(encodedHeader + '.' + encodedPayload).digest('base64');

  // Формирование JWT-токена
  return encodedHeader + '.' + encodedPayload + '.' + base64url.fromBase64(signature);
}

function requireAuth(req, res, next) {
    if (req.session && req.session.user) {
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  }

module.exports = {
  createJwtToken,
};