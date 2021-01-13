const { logger } = require('../utils');
const { deleteComment: removeComment } = require('../utils/Comments');

async function deleteComment(req, res) {
  try {
    const { commentId } = req.body;

    const {
      statusCode,
      message,
    } = await removeComment(commentId);
    logger.info(message);
    return res.status(statusCode).send(message).end();
  } catch (err) {
    logger.error(err);
    return res.status(500).send('500 Internal Server Error').end();
  }
};


module.exports = deleteComment;
