const kaholoPluginLibrary = require("@kaholo/plugin-library");

const testimCli = require("./testim-cli");
const testimCliBs = require("./testim-cli-browserstack");

module.exports = kaholoPluginLibrary.bootstrap({
  runCommand: testimCli.runCommand,
  runCommandBS: testimCliBs.runCommand,
});
