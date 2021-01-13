const { logger } = require('../utils');
const { updateUser: modifyUser } = require('../utils/Users');

async function updateUser(req, res) {
  try {
    const {
      email,
      newEmail,
      newPassword,
      newUsername,
      newRole,
    } = req.body;

    const updates = {};
    if (newEmail) {
      updates.email = newEmail;
    }
    if (newPassword) {
      updates.password = newPassword;
    }
    if (newUsername) {
      updates.username = newUsername;
    }
    if (newRole) {
      updates.role = newRole;
    }

    const {
      statusCode,
      message,
    } = await modifyUser(email, updates);

    return res.status(statusCode).send(message).end();
  } catch (err) {
    logger.error(err);
    return res.status(500).send('500 Internal Server Error').end();
  }
};

module.exports = updateUser;
