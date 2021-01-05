function secureAccess(req, res, next) {
  if (process.env.SECURE_ACCESS === 'false') {
    return next();
  }
  const key = req.get('secure-access-key');
  if (key === process.env.SECURE_ACCESS_KEY) {
    return next();
  }
  return res.status(401).send('Unauthorized').end();
};

module.exports = secureAccess;
