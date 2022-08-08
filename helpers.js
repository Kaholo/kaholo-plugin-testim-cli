const util = require("util");
const childProcess = require("child_process");

const {
  TESTIM_CLI_NAME,
} = require("./consts.json");

const exec = util.promisify(childProcess.exec);

function trimCommand(command) {
  const prefix = `${TESTIM_CLI_NAME} `;
  if (command.startsWith(prefix)) {
    return command.slice(prefix.length);
  }
  return command;
}

module.exports = {
  exec,
  trimCommand,
};
