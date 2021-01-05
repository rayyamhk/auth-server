const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { logger, getDatabase } = require('../utils');

async function authenticate(req, res) {
  try {
    const database = await getDatabase();
    const Users = await database.collection('Users');

    const { email, password } = req.body;
    
    if (!email || !password) {
      logger.warn('Missing data');
      return res.status(400).send('Missing data').end();
    }

    const user = await Users.findOne({ email });

    if (!user) {
      logger.warn('User does not exist');
      return res.status(400).send('Incorrect email or password').end();
    }

    if (user.isBlocked) {
      logger.warn('Account has been suspended');
      return res.status(403).send('Account has been suspended').end();
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      const payload = {
        username: user.username,
        email: user.email,
      };
      const accessToken = await jwt.sign(payload, process.env.JWT_PRIVATE_KEY, { expiresIn: '15m' });
      const refreshToken = await jwt.sign(payload, process.env.JWT_REFRESH_PRIVATE_KEY, { expiresIn: '30d' });

      await Users.updateOne({ email }, {
        $set: {
          lastLogin: new Date().toISOString(),
          loginAttempts: 0,
          refreshToken,
        }
      }, { upsert: false });

      logger.info('Log in successfully');
      return res.status(200).json({
        accessToken,
        refreshToken,
      }).end();
    }

    if (user.loginAttempts === 4) {
      await Users.updateOne({ email }, {
        $set: {
          loginAttempts: 5,
          isBlocked: true,
        }
      }, { upsert: false });
      logger.warn('Account has been suspended, too many login failures');
      return res.status(403).send('Account has been suspended, too many login failures').end();
    }

    await Users.updateOne({ email }, {
      $set: {
        loginAttempts: user.loginAttempts + 1,
      }
    }, { upsert: false });
    logger.warn('Incorrect password');
    return res.status(400).send('Incorrect email or password').end();

  } catch (err) {
    logger.error(err);
    return res.status(500).send('500 Internal Server Error').end();
  }
};

module.exports = authenticate;
