#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/index.ts
var import_config = require("dotenv/config");
var import_async_listen = require("async-listen");
var import_commander = require("commander");
var import_fs = require("fs");
var import_http = __toESM(require("http"));
var import_os = __toESM(require("os"));
var import_path = __toESM(require("path"));
var import_picocolors = __toESM(require("picocolors"));
var import_url = __toESM(require("url"));
var import_child_process = require("child_process");
var import_jwt_decode = require("jwt-decode");
var import_axios = __toESM(require("axios"));
var FILENAME = ".zama-cocktails";
var UserCancellationError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "UserCancellationError";
  }
};
function getConfigFilePath() {
  const homeDir = import_os.default.homedir();
  return import_path.default.join(homeDir, FILENAME);
}
function writeToConfigFile(data) {
  try {
    (0, import_fs.writeFileSync)(getConfigFilePath(), JSON.stringify(data));
  } catch (error) {
    console.error("Error writing to local config file.", error);
  }
}
function readJwtFromConfigFile() {
  try {
    const filePath = getConfigFilePath();
    if (!(0, import_fs.existsSync)(filePath)) {
      console.error("Error: you need to login before proceed");
      process.exit(1);
    }
    const content = (0, import_fs.readFileSync)(filePath, {
      encoding: "utf-8",
      flag: "r"
    });
    const { jwt } = JSON.parse(content);
    if (!jwt) {
      console.error("Error: you need to login before proceed");
      process.exit(1);
    }
    const { exp } = (0, import_jwt_decode.jwtDecode)(jwt);
    const currentTime = (/* @__PURE__ */ new Date()).getTime() / 1e3;
    if (currentTime > (exp ?? 0)) {
      console.error("Error: authentication expired, please login again");
      process.exit(1);
    }
    return jwt;
  } catch (error) {
    console.error(
      "Error reading the local config file.",
      error.name
    );
  }
}
function getVersion() {
  const packageJson = (0, import_fs.readFileSync)(
    import_path.default.join(__dirname, "..", "package.json"),
    "utf-8"
  );
  const { version: version2 } = JSON.parse(packageJson);
  return version2;
}
var program = new import_commander.Command();
var version = getVersion();
program.name("zama-cli").description("Zama Cocktails generator CLI").version(version);
program.command("login").description("Authenticate with Zama Cocktails service").action(async (...args) => {
  if (args.length !== 2) {
    console.error("Usage: `zama-cli login`.");
    process.exit(1);
  }
  if (!process.env.CLIENT_URL) {
    console.error("Missing env CLIENT_URL");
    process.exit(1);
  }
  const oraModule = await import("ora");
  const ora = oraModule.default;
  const server = import_http.default.createServer();
  const { port } = await (0, import_async_listen.listen)(server, 0, "127.0.0.1");
  const authPromise = new Promise((resolve, reject) => {
    server.on("request", (req, res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );
      switch (req.method) {
        case "OPTIONS":
          {
            res.writeHead(200);
            res.end();
          }
          break;
        case "GET":
          {
            const parsedUrl = import_url.default.parse(req.url, true);
            const queryParams = parsedUrl.query;
            if (!queryParams.jwt) {
              res.writeHead(200);
              res.end();
              reject(
                new UserCancellationError("Login process cancelled by user.")
              );
            } else {
              res.writeHead(200);
              res.end();
              resolve(queryParams);
            }
          }
          break;
        default:
          res.writeHead(405);
          res.end();
      }
    });
  });
  const redirect = `http://127.0.0.1:${port}`;
  const confirmationUrl = new URL(`${process.env.CLIENT_URL}/auth/devices`);
  confirmationUrl.searchParams.append("redirect", redirect);
  console.log(
    `If something goes wrong, copy and paste this URL into your browser: ${import_picocolors.default.bold(
      confirmationUrl.toString()
    )}
`
  );
  (0, import_child_process.spawn)("open", [confirmationUrl.toString()]);
  const spinner = ora("Waiting for authentication...\n\n");
  try {
    spinner.start();
    const authData = await authPromise;
    spinner.stop();
    writeToConfigFile(authData);
    console.log(
      `Authentication successful: wrote key to config file. To view it, type 'cat ~/${FILENAME}'.
`
    );
    server.close();
    process.exit(0);
  } catch (error) {
    if (error instanceof UserCancellationError) {
      console.log("Authentication cancelled.\n");
      server.close();
      process.exit(0);
    } else {
      console.error("Authentication failed:", error);
      server.close();
      process.exit(1);
    }
  }
});
program.command("gen-key").description("Generate a new API key").addArgument(
  new import_commander.Argument("<type>", "type of the API key to be generated").choices([
    "read",
    "write"
  ])
).action(async (type) => {
  console.log(`gen-key: ${type}`);
  const jdk = readJwtFromConfigFile();
  try {
    const response = await import_axios.default.post(
      `${process.env.API_URL}/api-keys`,
      {
        type
      },
      { headers: { Authorization: `Bearer ${jdk}` } }
    );
    if (response.data.key) {
      console.log(`${type} API key generated: ${response.data.key}`);
    }
  } catch (error) {
    if ((0, import_axios.isAxiosError)(error)) {
      console.error(`Failed to create API key: ${error.message}`);
    }
  }
  process.exit(0);
});
program.parse();
