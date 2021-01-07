const {
  getDatabase,
  genVerification,
  sendMail,
  Cache,
  logger,
} = require('../utils');

const codeCache = new Cache({
  ttl: 3 * 60 * 1000, // 3m
  period: 60 * 60 * 1000, // 1h
});

const allowedCache = new Cache({
  ttl: 5 * 60 * 1000, // 5m
  period: 60 * 60 * 1000, // 1h
});

async function recovery(req, res) {
  const { task } = req.query;

  if (task === 'verify') {
    const { code, email } = req.body;
    const item = codeCache.get(email);
    // if submit nothing or the email hasn't been requested for recovery
    if (!code || !item) {
      return res.status(400).send('Bad request').end();
    }

    if (item !== code) {
      return res.status(403).send('Verification code does not match').end();
    }

    codeCache.remove(email);

    // user with same email and same ip is allowed to change his/her
    // password within the next 5 minutes
    const key = `${email}|${req.ip}`;
    allowedCache.set(key, true);
    return res.status(200).send('Verification successful').end();
  }

  if (task === 'reset') {
    const { email, password } = req.body;
    // check if the client is allowed to change password or not
    const key = `${email}|${req.ip}`;
    const isAllowed = allowedCache.get(key);
    if (!email || !password || !isAllowed) {
      return res.status(400).send('Bad request').end();
    }

    // remove the permit immediately. 
    allowedCache.remove(key);

    try {
      const database = await getDatabase();
      const Users = await database.collection('Users');

      const options = {
        $set: {
          password,
          updatedAt: new Date().toISOString(),
        },
      };
      const result = await Users.updateOne({ email }, options, { upsert: false });

      if (result.modifiedCount === 1) {
        return res.status(200).send('Your password has been changed successfully').end();
      }

      return res.status(400).send('Email does not exist').end();
    } catch (error) {
      return res.status(500).send('500 Internal Server Error').end();
    }
  }

  // generate verification code
  const { email } = req.body;
  if (!email) {
    return res.status(400).send('Bad request').end();
  }
  const verificationCode = genVerification();
  codeCache.set(email, verificationCode);
  
  try {
    await sendMail({
      to: `User <${email}>`,
      subject: 'Reset your password',
      text: `Your verification code: ${verificationCode}`,
    });
    return res.status(200).send(`Verification code has been sent to your email address, please verify it within 3 minutes.`).end();
  } catch (err) {
    logger.error(err);
    return res.status(500).send('500 Internal Server Error').end();
  }
};

module.exports = recovery;
