const {
  getDatabase,
  logger,
  searchQueryConstructor
} = require('../utils');

async function getUsers(req, res) {
  try {
    const database = await getDatabase();
    const collection = await database.collection('Users');

    const options = searchQueryConstructor(req.query);
    const users = await collection.find({}, options).toArray();

    logger.info('Retrieve successfully!');
    return res.status(200).send(users).end();
  } catch (err) {
    logger.error(err);
    return res.status(500).send('500 Internal Server Error').end();
  }
};

module.exports = getUsers;
