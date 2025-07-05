const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto123';

function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    provider: user.provider
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
 
module.exports = { generateToken, verifyToken };
