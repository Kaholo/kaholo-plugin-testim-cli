const util = require("util");
const childProcess = require("child_process");

const exec = util.promisify(childProcess.exec);

function trimCommand(command) {
  if (command.startsWith("testim ")) {
    return command.slice(7, command.length);
  }
  return command;
}

module.exports = {
  exec,
  trimCommand,
};
