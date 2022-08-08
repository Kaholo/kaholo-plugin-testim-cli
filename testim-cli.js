const util = require("util");
const childProcess = require("child_process");
const { docker } = require("@kaholo/plugin-library");

const {
  TESTIM_DOCKER_IMAGE,
  ENVIRONMENTAL_VARIABLES_NAMES,
  TESTIM_CLI_NAME,
} = require("./consts.json");

const exec = util.promisify(childProcess.exec);

async function runCommand(params) {
  const {
    testimToken,
    testimProject,
    testimGrid,
    testimCommand,
  } = params;

  const shellEnvironmentalVariables = {};
  shellEnvironmentalVariables[ENVIRONMENTAL_VARIABLES_NAMES.TESTIM_PROJECT] = testimToken;
  shellEnvironmentalVariables[ENVIRONMENTAL_VARIABLES_NAMES.TESTIM_PROJECT] = testimProject;

  const tokenArg = `--token=$${ENVIRONMENTAL_VARIABLES_NAMES.TESTIM_TOKEN}`;
  const projectArg = `--project=$${ENVIRONMENTAL_VARIABLES_NAMES.TESTIM_PROJECT}`;
  const gridArg = `--grid="${testimGrid}"`;
  const preparedCommand = docker.sanitizeCommand(`${testimCommand} ${tokenArg} ${projectArg} ${gridArg}`, TESTIM_CLI_NAME);

  const dockerCommand = docker.buildDockerCommand({
    command: preparedCommand,
    image: TESTIM_DOCKER_IMAGE,
  });

  const {
    stdout,
    stderr,
  } = await exec(dockerCommand, {
    env: shellEnvironmentalVariables,
  });

  if (stderr && !stdout) {
    throw stderr;
  }

  return stdout;
}

module.exports = {
  runCommand,
};
