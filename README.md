# Kaholo Testim CLI Plugin
This plugin allows pipelines to use the Testim CLI. The Testim CLI is a command-line tool made for use with [Testim Automate](https://www.testim.io/test-automation-tool/). Testim Automate is fast and flexible authoring of AI-powered end-to-end tests—built for scale.

## Prerequisites
The Testim CLI must be installed on the Kaholo Agent(s) to use this plugin. This happens by default when running method "Run Testim CLI Command". To install the Testim CLI manually and see the resulting output, one can also use the Command Line plugin to run command `npm i -g @testim/testim-cli`. Note that simply putting `@testim/testim-cli` in package.json of the plugin will not work.

The expected error should the CLI NOT be properly installed is:

    Error : Error: Command failed: testim --version --token=$TESTIM_TOKEN --project=$TESTIM_PROJECT --grid="Testim-Grid"
    /bin/sh: 1: testim: not found

## Access and Authentication
Authentication is controlled by means of a Testim CLI Access Token and a Testim Project Id. These can be found at Setting | CLI when logged into the Testim Automate website. For example,

    npm i -g @testim/testim-cli && testim --token "CDbDF05hRsTCI49Y0lCuYbI49Y0lCuYbKPYbKPT3nUhx4klgbNQ" --project "cLaRJlTIXXeCLaRJlQr3" --grid "Testim-Grid"

In this example the Testim CLI Access Token is `CDbDF05hRsTCI49Y0lCuYbI49Y0lCuYbKPYbKPT3nUhx4klgbNQ` and the Testim Project Id is `cLaRJlTIXXeCLaRJlQr3`.

These two parameters are stored in Kaholo Accounts, which is found alongside Plugin Settings, accessed by clicking on the plugin's name in Kaholo's Setting | Plugins page. The Default Grid can also be configured there in Settings.

Additionally, to run tests on BrowserStack local instance, BrowserStackApiKey should be specified.

## Plugin Installation
For download, installation, upgrade, downgrade and troubleshooting of plugins in general, see [INSTALL.md](./INSTALL.md).

## Method: Run Testim CLI Command
This method runs any Testim CLI Command.

### Parameter: Working Directory
This is an optional working directory should the command require or produce files on the Agent's disk. If ommitted the default working directory in Kaholo 4.x is `/usr/src/app/workspace`.

### Parameter: Testim Grid Name
This is the name of the Testim Grid the command should work with. It will be included in the command for you with the `--grid` switch.

### Parameter: Command
This is the Testim command you wish to execute with the exception of `--token`, `--project`, and `--grid` components, which the plugin will inject into the command for you. If you are simply running the tests of that grid, the only command necessary is `testim`. I.e., if you run command `testim`, the actual command the plugin will run is `testim --token=$TESTIM_TOKEN --project=$TESTIM_PROJECT --grid="[Testim Grid Name]"` The environment variable is used so your Token is not exposed in Kaholo logs and error messages.

The simplest test command you can run even without valid token or project is `testim --version`.

If the command is omitted, this is equivalent to running command `testim`.

### Parameter: Install Latest Testim CLI
If checked, the latest Testim CLI will be installed before running the command. If already installed, unchecking this option may speed up the execution by a few seconds.

## Method: run Testim on BrowserStackLocal
This method runs Testim test on BrowserStack Local instance.

### Parameter: BrowserStack Local Identifier
Mandatory parameter for defining local id of BrowserStackLocal instance.

### Parameter: Testim Grid
This is the name of the Testim Grid the command should work with. It will be included in the command for you with the `--grid` switch.

### Parameter: Install Latest Testim CLI
If checked, the latest Testim CLI will be installed before running the command. If already installed, unchecking this option may speed up the execution by a few seconds.

### Parameter: Working Directory
This is an optional working directory should the command require or produce files on the Agent's disk. If ommitted the default working directory in Kaholo 4.x is `/usr/src/app/workspace`.

### Parameter: Command
Testim command (excluding `--token`, `--project`, `--grid` and `--browserstack-options` arguments)

### Parameter: Path to BrowserStackOptions
This is passed to Testim CLI command, that starts tests execution as `--browserstack-options`.</br>
See more: https://help.testim.io/docs/saucelabs-browserstack-options </br>
Sample file: [here](https://github.com/genesisthomas/testim-browserstack-local-sample)


## Notes:

- You may need to add a step to stop BrowserStack local if in case of some errors that may leave Browserstack local running in the background.
- BrowserStackLocal.zip can be overwritten if present in the current directory provided it is of Alpine version.
- BrowserStack Local method cannot run in parallel, because which ever action completes first will shut down the BS Local instance.


 If you are interested in adding more Testim functionality, please let us know! support@kaholo.io.