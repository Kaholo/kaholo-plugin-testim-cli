const { trimCommand, exec } = require("./helpers");
const {
  TESTIM_NPM_PACKAGE,
  TESTIM_CLI_NAME,
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

  const commandToExecute = `{ npm install -g ${TESTIM_NPM_PACKAGE} > /dev/null; } && ${TESTIM_CLI_NAME} ${preparedCommand}`;

  const {
    stdout,
    stderr,
  } = await exec(commandToExecute, {
    env: {
      ...process.env,
      ...shellEnvironmentalVariables,
    },
  });

  if (stderr && !stdout) {
    throw stderr;
  }

  return stdout;
}

module.exports = {
  runCommand,
};
