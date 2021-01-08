const bcrypt = require('bcrypt');
const getCollection = require('../getCollection');

async function createUser(username, email, password) {
  if (!username || !email || !password) {
    return {
      status: false,
      statusCode: 400,
      message: 'Missing data',
    };
  }

  try {
    const Users = await getCollection('Users');

    const isExisted = await Users.findOne({ email });
    if (isExisted) {
      return {
        status: false,
        statusCode: 400,
        message: 'The email already exists',
      };
    }

    const now = new Date().toISOString();
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    await Users.insertOne({
      username,
      email,
      password: hash,
      createdAt: now,
      updatedAt: now,
      lastLogin: null,
      loginAttempts: 0,
      isBlocked: false,
      refreshToken: null,
    });
    return {
      status: true,
      statusCode: 200,
      message: `User with email ${email} was created successfully!`,
    };
  } catch (err) {
    throw err;
  }
};

module.exports = createUser;
