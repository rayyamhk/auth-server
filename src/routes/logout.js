const { getDatabase, logger } = require('../utils');

async function logout(req, res) {
  try {
    const database = await getDatabase();
    const Users = await database.collection('Users');

    const { email } = req.body;
    const result = await Users.updateOne({ email }, {
      $set: {
        refreshToken: null,
      },
    }, { upsert: false });

    if (result.modifiedCount === 1) {
      logger.info('Logged out successfully');
      return res.status(200).send('Logged out successfully');
    }

    logger.warn('Email does not exist');
    return res.status(400).send('User does not exist');

  } catch (error) {
    logger.error(error);
    return res.status(500).send('Server error');
  }
};

module.exports = logout;
