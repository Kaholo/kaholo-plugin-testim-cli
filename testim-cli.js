const { docker } = require("@kaholo/plugin-library");

const { trimCommand, exec } = require("./helpers");
const {
  TESTIM_DOCKER_IMAGE,
  ENVIRONMENTAL_VARIABLES_NAMES,
} = require("./consts.json");

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
  const preparedCommand = trimCommand(`${testimCommand} ${tokenArg} ${projectArg} ${gridArg}`);

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
