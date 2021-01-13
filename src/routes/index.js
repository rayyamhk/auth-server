const getUsers = require('./getUsers');
const getUser = require('./getUser');
const deleteUser = require('./deleteUser');
const createUser = require('./createUser');
const updateUser = require('./updateUser');
const authenticate = require('./authenticate');
const authorize = require('./authorize');
const logout = require('./logout');
const recovery = require('./recovery');
const register = require('./register');
const createComment = require('./createComment');
const getComments = require('./getComments');


module.exports = {
  getUsers,
  getUser,
  deleteUser,
  createUser,
  updateUser,
  authenticate,
  authorize,
  logout,
  recovery,
  register,
  createComment,
  getComments,
};
