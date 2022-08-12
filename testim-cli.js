const { trimCommand, exec, assertPathExistence } = require("./helpers");
const {
  TESTIM_CLI_NAME,
  ENVIRONMENTAL_VARIABLES_NAMES,
} = require("./consts.json");

async function runCommand(params) {
  const {
    testimToken,
    testimProject,
    testimGrid,
    testimCommand,
    workingDirectory,
  } = params;

  const shellEnvironmentalVariables = {};
  shellEnvironmentalVariables[ENVIRONMENTAL_VARIABLES_NAMES.TESTIM_TOKEN] = testimToken;
  shellEnvironmentalVariables[ENVIRONMENTAL_VARIABLES_NAMES.TESTIM_PROJECT] = testimProject;

  const tokenArg = `--token=$${ENVIRONMENTAL_VARIABLES_NAMES.TESTIM_TOKEN}`;
  const projectArg = `--project=$${ENVIRONMENTAL_VARIABLES_NAMES.TESTIM_PROJECT}`;
  const gridArg = `--grid="${testimGrid}"`;
  const preparedCommand = trimCommand(`${testimCommand} ${tokenArg} ${projectArg} ${gridArg}`);

  const commandToExecute = `${TESTIM_CLI_NAME} ${preparedCommand}`;

  if (workingDirectory) {
    await assertPathExistence(workingDirectory);
  }

  const {
    stdout,
    stderr,
  } = await exec(commandToExecute, {
    env: {
      ...process.env,
      ...shellEnvironmentalVariables,
    },
    cwd: workingDirectory || process.cwd(),
  });

  if (stderr && !stdout) {
    throw stderr;
  }

  return stdout;
}

module.exports = {
  runCommand,
};
