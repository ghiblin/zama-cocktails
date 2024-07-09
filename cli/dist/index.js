#!/usr/bin/env node
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
var import_fs = require("fs");
var import_path = __toESM(require("path"));
var import_commander = require("commander");
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
});
program.parse();
