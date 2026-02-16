#!/usr/bin/env node

import { runCli } from "./index";

runCli(process.argv.slice(2))
  .then((code) => {
    process.exitCode = code;
  })
  .catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`CLI error: ${message}`);
    process.exitCode = 1;
  });
