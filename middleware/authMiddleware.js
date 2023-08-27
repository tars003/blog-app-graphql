const jwt = require('jsonwebtoken');

const jwtMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No token provided, user is not authenticated
    req.user = null;
    return next();
  }

  const token = authHeader.slice(7);
  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // Token verification failed
      req.user = null;
    } else {
      // Token is valid, add user to request
      req.user = decoded;
    }
    return next();
  });
};

module.exports = jwtMiddleware;
