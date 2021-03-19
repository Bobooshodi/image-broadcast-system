import { createConnection } from "typeorm";
import express from "express";
import withJson from "express-with-json";
import { pagination } from "typeorm-pagination";
import { default as Pino } from "pino-http";
import glob from "glob";
import path from "path";
import bodyParser from "body-parser";
import { EntityNotFoundError } from "typeorm/error/EntityNotFoundError";
import cors from "cors";
import { Mapper } from "@nartc/automapper";
import {
  RecipientListItemMappingProfile,
  RecipientListMappingProfile,
  ScheduleMappingProfile,
} from "./data-mapping-profiles";
import container from "./service-container/inversify.config";
import { JobServiceInterface } from "./services";
import { ServiceInterfaceTypes } from "./service-container/ServiceTypes";
import config from "../config";

const port = 3002;
const jobService = container.get<JobServiceInterface>(
  ServiceInterfaceTypes.ServiceTypes.jobService
);

function findAllControllers() {
  return glob
    .sync(path.join(__dirname, "controllers/*"), { absolute: true })
    .map((controllerPath) => require(controllerPath).default)
    .filter((applyController) => applyController);
}

function connectToDisqueServer() {
  jobService.connect(
    { host: config.DISQUE_HOST, port: config.DISQUE_PORT },
    (error) => {
      console.error(error);
    },
    () => {
      console.log("Disque Server is Up and Ready to accept jobs");
    }
  );
}

function initializeMappings() {
  Mapper.addProfile(ScheduleMappingProfile);
  Mapper.addProfile(RecipientListMappingProfile);
  Mapper.addProfile(RecipientListItemMappingProfile);
}

function errorHandler(error, req, res, next) {
  if (!error) {
    return next();
  }

  if (error) {
    res.status(500);
    res.json({ error: error.message });
  }
  console.error(error);
}

export function entityNotFoundErrorHandler(error, req, res, next) {
  if (!(error instanceof EntityNotFoundError)) {
    return next(error);
  }

  res.status(401);
  res.json({ error: "Not Found" });
}

export async function bootstrap() {
  await createConnection();
  initializeMappings();
  const app = withJson(express());
  app.use(entityNotFoundErrorHandler);
  app.use(errorHandler);

  connectToDisqueServer();

  app.listen(port, () => console.log("Listening on port", port));

  return app;
}
