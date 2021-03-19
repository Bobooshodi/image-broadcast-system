require("dotenv/config");
require("reflect-metadata");
require("ts-node/register");

require("./src/bootstrap-message-status-checker.ts")
  .bootstrap()
  .catch(console.error);
