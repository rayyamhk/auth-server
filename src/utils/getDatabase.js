const MongoClient = require('mongodb').MongoClient;
const logger = require('./logger');

let db = null;

async function getDatabase() {
  if (db) {
    return db;
  }

  try {
    const {
      MONGO_USERNAME,
      MONGO_PASSWORD,
      MONGO_DATABASE_NAME,
    } = process.env;
    const configs = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    const uri = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@auth.rzltx.mongodb.net/${MONGO_DATABASE_NAME}?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, configs);

    await client.connect();
    db = await client.db(MONGO_DATABASE_NAME);
    logger.info('MongoDB connection success!');
    return db;
  } catch (err) {
    throw err;
  }
};

module.exports = getDatabase;
