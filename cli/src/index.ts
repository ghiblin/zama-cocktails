#!/usr/bin/env node

import "dotenv/config";

import { listen } from "async-listen";
import { Command } from "commander";
import { readFileSync, writeFileSync } from "fs";
import http from "http";
import os from "os";
import path from "path";
import pc from "picocolors";
import url from "url";
import { ParsedUrlQuery } from "querystring";
import { spawn } from "child_process";

const FILENAME = ".zama-cocktails";

class UserCancellationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserCancellationError";
  }
}

function writeToConfigFile(data: ParsedUrlQuery) {
  try {
    const homeDir = os.homedir();
    const filePath = path.join(homeDir, FILENAME);
    writeFileSync(filePath, JSON.stringify(data));
  } catch (error) {
    console.error("Error writing to local config file.", error);
  }
}

function getVersion(): string {
  const packageJson = readFileSync(
    path.join(__dirname, "..", "package.json"),
    "utf-8"
  );
  const { version } = JSON.parse(packageJson);
  return version;
}

const program = new Command();
const version = getVersion();

program
  .name("zama-cli")
  .description("Zama Cocktails generator CLI")
  .version(version);

program
  .command("login")
  .description("Authenticate with Zama Cocktails service")
  .action(async (...args) => {
    if (args.length !== 2) {
      console.error("Usage: `zama-cli login`.");
      process.exit(1);
    }

    if (!process.env.CLIENT_URL) {
      console.error("Missing env CLIENT_URL");
      process.exit(1);
    }

    // need to import ora dynamically since it's ESM-only
    const oraModule = await import("ora");
    const ora = oraModule.default;

    // Create localhost server for our page to call back to
    const server = http.createServer();
    const { port } = await listen(server, 0, "127.0.0.1");

    // Set up an HTTP server that waits for a request containing an API key
    // as the only query parameter
    const authPromise = new Promise<ParsedUrlQuery>((resolve, reject) => {
      server.on("request", (req, res) => {
        // Set CORS headers for all responses
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
              const parsedUrl = url.parse(req.url as string, true);
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
      `If something goes wrong, copy and paste this URL into your browser: ${pc.bold(
        confirmationUrl.toString()
      )}\n`
    );
    spawn("open", [confirmationUrl.toString()]);
    const spinner = ora("Waiting for authentication...\n\n");

    try {
      spinner.start();
      const authData = await authPromise;
      spinner.stop();
      writeToConfigFile(authData);
      console.log(
        `Authentication successful: wrote key to config file. To view it, type 'cat ~/${FILENAME}'.\n`
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

program.parse();