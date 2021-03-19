import { createConnection } from "typeorm";
import express from "express";
import withJson from "express-with-json";
import bodyParser from "body-parser";
import { pagination } from "typeorm-pagination";
import cors from "cors";
import glob from "glob";
import path from "path";
import { EntityNotFoundError } from "typeorm/error/EntityNotFoundError";
import { Mapper } from "@nartc/automapper";
import {
  RecipientListItemMappingProfile,
  RecipientListMappingProfile,
  ScheduleMappingProfile,
  ScheduleRecipientStatusMappingProfile,
} from "./data-mapping-profiles";
import container from "./service-container/inversify.config";
import { JobServiceInterface } from "./services";
import { ServiceInterfaceTypes } from "./service-container/ServiceTypes";

const port = 3003;
const jobService = container.get<JobServiceInterface>(
  ServiceInterfaceTypes.ServiceTypes.jobService
);

function connectToDisqueServer() {
  jobService.connect(
    { host: process.env.DISQUE_HOST, port: process.env.DISQUE_PORT },
    (error) => {
      console.error(error);
    },
    () => {
      console.log("Disque Server is Up and Ready to process jobs");
      jobService.processCheckJobs();
    }
  );
}

function findAllControllers() {
  return glob
    .sync(path.join(__dirname, "controllers/*"), { absolute: true })
    .map((controllerPath) => require(controllerPath).default)
    .filter((applyController) => applyController);
}

function initializeMappings() {
  Mapper.addProfile(ScheduleMappingProfile);
  Mapper.addProfile(RecipientListMappingProfile);
  Mapper.addProfile(RecipientListItemMappingProfile);
  Mapper.addProfile(ScheduleRecipientStatusMappingProfile);
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
  const app = withJson(express());
  app.use(bodyParser.json());
  app.use(pagination);
  app.use(cors());

  initializeMappings();
  findAllControllers().map((applyController) => applyController(app));
  app.use(entityNotFoundErrorHandler);
  app.use(errorHandler);

  connectToDisqueServer();

  app.listen(port, () => console.log("Listening on port", port));

  return app;
}
