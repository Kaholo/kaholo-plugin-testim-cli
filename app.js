const kaholoPluginLibrary = require("@kaholo/plugin-library");
const testimCli = require("./testim-cli");

module.exports = kaholoPluginLibrary.bootstrap({
  runCommand: testimCli.runCommand,
});
