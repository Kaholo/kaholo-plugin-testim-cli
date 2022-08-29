const { trimCommand, exec, assertPathExistence } = require("./helpers");
const {
  TESTIM_MODULE_PATH,
  ENVIRONMENTAL_VARIABLES_NAMES,
} = require("./consts.json");

const PLUGIN_ABSOLUTE_PATH = module.path;

async function runCommand(params) {
  const {
    testimToken,
    testimProject,
    testimGrid,
    testimCommand,
    workingDirectory,
  } = params;

  if (workingDirectory) {
    await assertPathExistence(workingDirectory);
  }

  const shellEnvironmentalVariables = {};
  shellEnvironmentalVariables[ENVIRONMENTAL_VARIABLES_NAMES.TESTIM_TOKEN] = testimToken;
  shellEnvironmentalVariables[ENVIRONMENTAL_VARIABLES_NAMES.TESTIM_PROJECT] = testimProject;

  const tokenArg = `--token=$${ENVIRONMENTAL_VARIABLES_NAMES.TESTIM_TOKEN}`;
  const projectArg = `--project=$${ENVIRONMENTAL_VARIABLES_NAMES.TESTIM_PROJECT}`;
  const gridArg = `--grid="${testimGrid}"`;
  const preparedCommand = trimCommand(`${testimCommand} ${tokenArg} ${projectArg} ${gridArg}`);

  const commandToExecute = `node ${PLUGIN_ABSOLUTE_PATH}/node_modules/${TESTIM_MODULE_PATH} ${preparedCommand}`;

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
