const bcrypt = require('bcrypt');
const { logger, getDatabase } = require('../utils');

async function createUser(req, res) {
  try {
    const database = await getDatabase();
    const collection = await database.collection('Users');
    const {
      username,
      email,
      password,
    } = req.body;

    if (!username || !email || !password) {
      logger.warn('Missing data');
      return res.status(400).send('Missing data').end();
    }

    const isExisted = await collection.findOne({ email });
    if (isExisted) {
      logger.warn('User already exists');
      return res.status(400).send('The email already exists').end();
    }

    const now = new Date().toISOString();
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    await collection.insertOne({
      username,
      email,
      password: hash,
      createdAt: now,
      updatedAt: now,
      lastLogin: null,
      loginAttempts: 0,
      isBlocked: false,
    });
    logger.info(`Insert successfully!`);
    return res.status(200).send(`User with email ${email} was added successfully!`).end();
  } catch (err) {
    logger.error(err);
    return res.status(500).send('500 Internal Server Error').end();
  }
};

module.exports = createUser;
