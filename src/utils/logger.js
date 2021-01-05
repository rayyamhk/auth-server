const chalk = require('chalk');

module.exports = {
  log: (args) => console.log(chalk.green(args)),
  info: (args) => console.info(chalk.yellowBright(args)),
  error: (args) => console.error(chalk.redBright(args)),
  warn: (args) => console.warn(chalk.keyword('orange')(args)),
};
