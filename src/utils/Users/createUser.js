const bcrypt = require('bcrypt');
const getCollection = require('../getCollection');

// role can be either 'user' or 'admin'
async function createUser(username, email, password, role) {
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
      avatar: null,
      age: null,
      gender: null,
      bio: null,
      area: null,
      district: null,
      address: null,
      role: role || 'user',
      createdAt: now,
      updatedAt: now,
      lastLogin: null,
      loginAttempts: 0,
      isBlocked: false,
      isActivated: false,
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
