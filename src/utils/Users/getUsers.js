const getCollection = require('../getCollection');
const searchQueryConstructor = require('../searchQueryConstructor');

async function getUsers(query) {
  try {
    const Users = await getCollection('Users');
    const options = searchQueryConstructor(query);
    const users = await Users.find({}, options).toArray();
    return {
      status: true,
      statusCode: 200,
      message: 'Retrieve successfully',
      payload: users,
    };
  } catch (err) {
    throw err;
  }
};

module.exports = getUsers;
