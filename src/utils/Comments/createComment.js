const getCollection = require('../getCollection');

async function createComment(postId, username, comment) {
  if (!postId || !username || !comment) {
    return {
      status: false,
      statusCode: 400,
      message: 'Missing data',
    };
  }

  try {
    const Comments = await getCollection('Comments');
    const now = new Date().toISOString();
    await Comments.insertOne({
      postId,
      username,
      comment,
      createdAt: now,
    });
    return {
      status: true,
      statusCode: 200,
      message: 'Comment created',
    };
  } catch (err) {
    throw err;
  }
};

module.exports = createComment;
