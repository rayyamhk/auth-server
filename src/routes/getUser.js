const { logger, getDatabase } = require('../utils');

async function getUser(req, res) {
  try {
    const database = await getDatabase();
    const collection = await database.collection('Users');

    const { email } = req.body;

    if (!email) {
      logger.warn('Missing data');
      return res.status(400).send('Missing data').end();
    }

    const user = await collection.findOne({ email });
    if (user) {
      logger.info('Retrieve successfully!');
      return res.status(200).send(user).end();
    }

    logger.warn('User does not exist');
    return res.status(400).send('User does not exist').end();
    
  } catch (err) {
    logger.error(err);
    return res.status(500).send('500 Internal Server Error').end();
  }
};

module.exports = getUser;
