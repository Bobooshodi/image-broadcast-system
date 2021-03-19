require("dotenv/config");
require("reflect-metadata");
require("ts-node/register");

require("./src/bootstrap-message-admin.ts").bootstrap().catch(console.error);
