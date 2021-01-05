const bcrypt = require('bcrypt');
const { getDatabase, logger } = require('../utils');

async function updateUser(req, res) {
  try {
    const database = await getDatabase();
    const collection = await database.collection('Users');

    const { email, newEmail, newPassword, newUsername } = req.body;

    if (!email || (!newEmail && !newPassword && !newUsername)) {
      logger.warn('Missing data');
      return res.status(400).send('Missing data').end();
    }

    const replacement = await genReplacement({ newEmail, newPassword, newUsername });
    const result = await collection.updateOne({ email }, replacement, { upsert: false });

    if (result.modifiedCount === 1) {
      logger.info('Updated successfully');
      return res.status(200).send(`User with email ${email} was updated successfully`);
    }

    logger.warn('User does not exist');
    return res.status(400).send(`User with email ${email} dose not exist`);
    
  } catch (err) {
    logger.error(err);
    return res.status(500).send('500 Internal Server Error').end();
  }
}

async function genReplacement(fields) {
  try {
    const { newEmail, newPassword, newUsername } = fields;

    const options = {};
    if (newEmail) {
      options.email = newEmail;
    }
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newPassword, salt);
      options.password = hash;
    }
    if (newUsername) {
      options.username = newUsername;
    }
    options.updatedAt = new Date().toISOString();

    return { $set: options };
  } catch (err) {
    logger.error(err);
    return res.status(500).send('500 Internal Server Error').end();
  }
};

module.exports = updateUser;
