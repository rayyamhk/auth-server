const requestIp = require('request-ip');

function ipService() {
  return (req, res, next) => {
    req.ip = requestIp.getClientIp(req);
    console.log(requestIp.getClientIp(req));
    next();
  };
};

module.exports = ipService;
