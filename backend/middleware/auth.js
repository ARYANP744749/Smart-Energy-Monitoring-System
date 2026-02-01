const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.header('x-auth-token') || req.header('authorization');
  if (!token) return res.status(401).json({ msg: 'No token, auth denied' });

  try {
    const actual = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
    const decoded = jwt.verify(actual, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
