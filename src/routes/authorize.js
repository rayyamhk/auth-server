const jwt = require('jsonwebtoken');
const { getDatabase, logger } = require('../utils');

async function authorize(req, res) {
  const { email } = req.body;

  try {
    const accessBearerToken = req.get('jwt-access-token');
    if (!accessBearerToken || accessBearerToken.split(' ').length !== 2) {
      logger.warn('Unauthorized: Missing access token');
      return res.status(403).send('Unauthorized').end();
    }

    const accessToken = accessBearerToken.split(' ')[1];
    const user = await jwt.verify(accessToken, process.env.JWT_PRIVATE_KEY);

    const database = await getDatabase();
    const Users = await database.collection('Users');
    const result = await Users.findOne({ email });
    if (!result.refreshToken) {
      logger.warn('Unauthorized: Logged out because your refresh token is missing');
      return res.status(403).send('Unauthorized').end();
    }

    logger.info('Authorized: Correct access token');
    return res.status(200).json({ user }).end();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {

      const refreshBearerToken = req.get('jwt-refresh-token');
      if (!refreshBearerToken || refreshBearerToken.split(' ').length !== 2) {
        logger.warn('Unauthorized: Access token expired and missing refresh token');
        return res.status(403).send('Unauthorized').end();
      }
  
      const refreshToken = refreshBearerToken.split(' ')[1];

      let Users = null;

      try {
        const database = await getDatabase();
        Users = await database.collection('Users');
        const result = await Users.findOne({ email });

        if (result.refreshToken !== refreshToken) {
          logger.warn('Unauthorized: Access token expired and incorrect refresh token');
          return res.status(403).send('Unauthorized').end();
        }

        const user = await jwt.verify(refreshToken, process.env.JWT_REFRESH_PRIVATE_KEY);
        const payload = { username: user.username, email: user.email };
        const accessToken = await jwt.sign(payload, process.env.JWT_PRIVATE_KEY, { expiresIn: '15m' });
        logger.info('Authorized: Access token refreshed');
        return res.status(200).json({ user, accessToken }).end();

      } catch (err) {
        logger.warn('Unauthorized: Access token and Refresh token expired');
        await Users.updateOne({ email }, {
          $set: {
            refreshToken: null,
          },
        }, { upsert: false }); // log out
        return res.status(403).send('Unauthorized').end();
      }
    }

    logger.warn('Unauthorized: Incorrect access token');
    return res.status(403).send('Unauthorized').end();
  }
};

module.exports = authorize;
