const { docker } = require("@kaholo/plugin-library");
const {
  exec,
  trimCommand,
} = require("./helpers");
const {
  TESTIM_DOCKER_IMAGE,
} = require("./consts.json");

const environmentalVariablesNames = {
  testimToken: "TESTIM_TOKEN",
  testimProject: "TESTIM_PROJECT",
};

const shellEnvironmentalVariables = {};

async function runCommand(params) {
  const {
    testimToken,
    testimProject,
    testimGrid,
    testimCommand,
  } = params;

  shellEnvironmentalVariables[environmentalVariablesNames.testimToken] = testimToken;
  shellEnvironmentalVariables[environmentalVariablesNames.testimProject] = testimProject;

  const tokenArg = `--token=$${environmentalVariablesNames.testimToken}`;
  const projectArg = `--project=$${environmentalVariablesNames.testimProject}`;
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
