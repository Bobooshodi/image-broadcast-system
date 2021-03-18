import express from "express";
import { IExpressWithJson, JsonErrorResponse } from "express-with-json/dist";
import { validationResult } from "express-validator";

import container from "../service-container/inversify.config";

import { ServiceInterfaceTypes } from "../service-container/ServiceTypes";
import { ScheduleServiceInterface } from "../services";

const scheduleService = container.get<ScheduleServiceInterface>(
  ServiceInterfaceTypes.ServiceTypes.sheduleService
);

export async function create(req: any) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new JsonErrorResponse({ errors: errors.array() });
    }

    const { message, date, recipientList } = req.body;

    return scheduleService.createAndSave(message, date, recipientList);
  } catch (error) {
    console.error(error);
    throw new JsonErrorResponse({ error: "some error occured" });
  }
}

export async function remove(req: express.Request) {
  const { id } = req.params;

  const res = await scheduleService.delete(id);
  return { ok: res };
}

export async function get(req: express.Request) {
  const { id } = req.params;

  return await scheduleService.getById(id);
}

export async function getAll(req: express.Request) {
  return await scheduleService.getAllPaginated();
}

export async function update(req: express.Request) {
  const { id } = req.params;

  const existingImage = await scheduleService.getById(id);

  return await scheduleService.update(existingImage);
}

export default (app: IExpressWithJson) => {
  app.postJson("/schedules", create);
  app.deleteJson("/schedules/:id", remove);
  app.getJson("/schedules", getAll);
  app.getJson("/schedules/:id", get);
};
