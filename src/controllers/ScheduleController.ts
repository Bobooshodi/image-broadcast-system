import express from "express";
import { IExpressWithJson, JsonErrorResponse } from "express-with-json/dist";
import { validationResult } from "express-validator";

import container from "../service-container/inversify.config";

import { ServiceInterfaceTypes } from "../service-container/ServiceTypes";
import {
  JobServiceInterface,
  LoggerServiceInterface,
  ScheduleMessageStatusServiceInterface,
  ScheduleServiceInterface,
} from "../services";
import { JobQueue, JobType } from "../enums";

const scheduleService = container.get<ScheduleServiceInterface>(
  ServiceInterfaceTypes.ServiceTypes.sheduleService
);

const jobService = container.get<JobServiceInterface>(
  ServiceInterfaceTypes.ServiceTypes.jobService
);

const logger = container
  .get<LoggerServiceInterface>(ServiceInterfaceTypes.ServiceTypes.loggerService)
  .getLogger();

const messageStatusService = container.get<ScheduleMessageStatusServiceInterface>(
  ServiceInterfaceTypes.ServiceTypes.schedumeMessageStatusService
);

export async function create(req: any) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new JsonErrorResponse({ errors: errors.array() });
    }

    const { message, date, recipientList } = req.body;

    const schedule = await scheduleService.createAndSave(
      message,
      date,
      recipientList
    );

    await jobService.queueJob(
      JSON.stringify({ scheduleId: schedule.id, type: JobType.ProcessMessage }),
      JobQueue.ProcessQueue,
      (err, jobDetails) => {
        logger.info(
          `Message Schedule #${schedule.id} queued successfully, JOB DETAILS: ${jobDetails}`
        );
      }
    );

    return { message: "Message scheduled successfully.", schedule };
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

export async function getMessageStatuses(req: express.Request) {
  const { id } = req.params;

  return await messageStatusService.getByScheduleId(id);
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
  app.getJson("/schedules/:id/message_statuses", getMessageStatuses);
};
