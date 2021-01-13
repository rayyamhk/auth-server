const jwt = require('jsonwebtoken');
const getUser = require('./getUser');
const updateUser = require('./updateUser');

async function authorize(email, accessToken, refreshToken) {
  try {
    if (!accessToken) {
      return {
        status: false,
        statusCode: 403,
        message: 'Unauthorized: Missing access token',
      };
    }

    const user = await jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_KEY);

    const { status, statusCode, message, payload: result } = await getUser(email);

    if (!status) {
      return {
        status,
        statusCode,
        message,
      };
    }

    if (!result.refreshToken) {
      return {
        status: false,
        statusCode: 403,
        message: 'Unauthorized: Logged out because your refresh token is missing',
      };
    }

    return {
      status: true,
      statusCode: 200,
      message: 'Authorized: Correct access token',
      payload: { user },
    };

  } catch (err) {
    if (err.name === 'TokenExpiredError') {

      if (!refreshToken) {
        return {
          status: false,
          statusCode: 403,
          message: 'Unauthorized: Access token expired and missing refresh token',
        };
      }

      try {
        const { payload: result } = await getUser(email);

        if (result.refreshToken !== refreshToken) {
          return {
            status: false,
            statusCode: 403,
            message: 'Unauthorized: Access token expired and incorrect refresh token',
          };
        }

        const user = await jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_KEY);
        const payload = { username: user.username, email: user.email };
        const accessToken = await jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_KEY, { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRED });
        return {
          status: true,
          statusCode: 200,
          message: 'Authorized: Access token refreshed',
          payload: { user, accessToken },
        };
      } catch (err) {
        await updateUser(email, { refreshToken: null }); // log out
        return {
          status: false,
          statusCode: 403,
          message: 'Unauthorized: Access token and Refresh token expired',
        };
      }
    }

    if (err.name === 'JsonWebTokenError') {
      return {
        status: false,
        statusCode: 403,
        message: 'Unauthorized: Incorrect access token',
      };
    }
    throw err;
  }
};

module.exports = authorize;
