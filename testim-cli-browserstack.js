const decompress = require("decompress");
const fs = require("fs");
const got = require("got");
const { promisify } = require("util");
const stream = require("stream");
const childProcess = require("child_process");
const EventEmitter = require("events");
const { access } = require("fs/promises");

const exec = promisify(childProcess.exec);
const pipeline = promisify(stream.pipeline);

class TestimEmitter extends EventEmitter {}

async function runCommand(params) {
  const testimEmitter = new TestimEmitter();

  const {
    bsApiKey,
    bsBinaryUrl = "https://www.browserstack.com/browserstack-local/BrowserStackLocal-alpine.zip",
    localId,
    testimToken,
    testimProject,
    testimGrid,
    testimCommand,
    workingDirectory,
    bsOptionsFile,
    shouldInstallTestimCLI,
  } = params;

  if (workingDirectory) {
    await assertPathExistence(workingDirectory);
  }

  const filePath = await prepareBrowserStackBinary(bsBinaryUrl);

  const bsAbortController = runBrowserStackLocal(filePath, bsApiKey, localId);
  console.info("BrowserStackLocal started");

  if (shouldInstallTestimCLI) {
    await installTestim();
  }

  const execOutput = {
    stdout: "",
    stderr: "",
  };
  try {
    const inputArgs = [
      "--token", testimToken,
      "--project", testimProject,
      "--grid", testimGrid,
      "--browserstack-options", bsOptionsFile,
    ];

    const testimArgs = prepareArgs(testimCommand, inputArgs);

    const child = childProcess.spawn(
      "testim",
      testimArgs,
      { cwd: workingDirectory || process.cwd() },
    );
    child.stdout.on("data", (data) => {
      process.stdout.write(data.toString());
      execOutput.stdout += data ? data.toString() : "";
    });
    // spit stderr to screen
    child.stderr.on("data", (data) => {
      process.stdout.write(data.toString());
      execOutput.stderr += data ? data.toString() : "";
    });

    child.on("close", (code) => {
      testimEmitter.emit("testim-end");
      console.info(`Finished with code ${code}`);
    });
  } finally {
    await waitForEvent(testimEmitter, "testim-end");

    if (bsAbortController) {
      try {
        console.info("Stopping BrowserStackLocal process.");
        bsAbortController.abort();
      } catch (e) {
        console.error("Could not stop BrowserStackLocal process: ", e);
      }
    }
  }

  handleTestimResponse(execOutput.stdout);

  return execOutput;
}

async function assertPathExistence(path) {
  try {
    await access(path, fs.constants.F_OK);
  } catch {
    throw new Error(`Path ${path} does not exist`);
  }
}

function waitForEvent(emitter, eventType) {
  return new Promise((resolve) => {
    emitter.on(eventType, resolve);
  });
}

async function prepareBrowserStackBinary(bsBinaryUrl) {
  const zipFileName = "BrowserStackLocal.zip";

  if (!fs.existsSync(`./${zipFileName}`)) {
    await downloadBrowserStackBinary(bsBinaryUrl, zipFileName);
  } else {
    console.info("BrowserStackLocal binary was already downloaded. Skipping downloading.");
  }

  const filePath = "./dist/BrowserStackLocal";
  if (!fs.existsSync(filePath)) {
    await unzip(zipFileName); // unzip to ./dist
    fs.chmodSync(filePath, "777");
  }
  return filePath;
}

async function downloadBrowserStackBinary(bsLocalBinaryUrl, fileName) {
  const downloadStream = got.stream(bsLocalBinaryUrl);
  const fileWriterStream = fs.createWriteStream(fileName);

  let lastProgressPercentage = -10;
  downloadStream.on("BrowserStackLocal downloadProgress", ({ transferred, total, percent }) => {
    const percentage = Math.round(percent * 100);
    if (lastProgressPercentage + 9 < percentage) {
      console.info(`progress: ${transferred}/${total} (${percentage}%)`);
      lastProgressPercentage = percentage;
    }
  });

  try {
    await pipeline(downloadStream, fileWriterStream);
    console.info(`BrowserstackLocal downloaded to ${fileName}`);
  } catch (error) {
    throw new Error(`Something went wrong when downloading BrowserstackLocal binary:  ${error.message}`);
  }
  return `${process.cwd()}/${fileName}`;
}

async function unzip(fileName) {
  return (async () => {
    let decompressed;
    try {
      decompressed = await decompress(fileName, "dist");
    } catch (e) {
      throw new Error(`Error during unpacking ${fileName}: ${e}`);
    }
    return decompressed;
  })();
}

function runBrowserStackLocal(filePath, bsApiKey, localId) {
  const controller = new AbortController();
  const { signal } = controller;

  const args = ["--key", bsApiKey, "--force-local"];

  if (localId) {
    args.push("--local-identifier", localId);
  }

  const child = childProcess.execFile(filePath, args, { signal });

  child.stdout.on("data", (data) => {
    console.info(data.toString());
  });
  child.stderr.on("data", (data) => {
    console.info(data.toString());
  });
  return controller;
}

async function installTestim() {
  const instlTestimCmd = "npm i -g @testim/testim-cli";

  try {
    await exec(instlTestimCmd);
  } catch (e) {
    throw new Error(`Error during testim/cli installation: ${e}`);
  }
}

function prepareArgs(testimCommand, args) {
  const testimArgs = testimCommand.split(" ");
  args.push(...testimArgs);

  if (!testimArgs.includes("--browser-timeout")) {
    args.push("--browser-timeout", "30000"); // Get browser from grid timeout in milliseconds
  }
  if (!testimArgs.includes("--new-browser-wait-timeout")) {
    args.push("--new-browser-wait-timeout", "1"); // Maximum get browser wait in minutes
  }

  return args;
}

function handleTestimResponse(output) {
  if (output.includes("Error: ")) {
    throw new Error(`Testim Client Error: ${output}`);
  }
}

module.exports = {
  runCommand,
};
