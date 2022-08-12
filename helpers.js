const util = require("util");
const childProcess = require("child_process");
const { access } = require("fs/promises");
const fs = require("fs");

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

async function assertPathExistence(path) {
  try {
    await access(path, fs.constants.F_OK);
  } catch {
    throw new Error(`Path ${path} does not exist`);
  }
}

module.exports = {
  exec,
  trimCommand,
  assertPathExistence,
};
