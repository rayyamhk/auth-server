const { logger, getDatabase } = require('../utils');

async function deleteUser(req, res) {
  try {
    const db = await getDatabase();
    const collection = await db.collection('Users');

    const { email } = req.body;

    if (!email) {
      logger.warn('Missing data');
      return res.status(400).send('Missing data').end();
    }

    const result = await collection.deleteOne({ email });
    if (result.deletedCount === 1) {
      logger.info(`${email}: Deleted successfully!`);
      return res.status(200).send(`User with email ${email} was deleted successfully!`);
    }
    logger.warn('User does not exist');
    return res.status(400).send('User does not exist').end();

  } catch (err) {
    logger.error(err);
    return res.status(500).send('500 Internal Server Error').end();
  }
};

module.exports = deleteUser;
