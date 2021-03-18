import { inject, injectable } from "inversify";
import { Mapper } from "@nartc/automapper";
import { getRepository } from "typeorm";

import { ServiceInterfaceTypes } from "../service-container/ServiceTypes";
import { ScheduleEntity } from "../entities";
import { ScheduleServiceInterface } from "./interfaces/ScheduleServiceInterface";
import { Schedule } from "../models";

@injectable()
export class ScheduleService implements ScheduleServiceInterface {
  private imageRepository = getRepository(ScheduleEntity);

  createAndSave(): Promise<Schedule> {
    throw new Error("Method not implemented.");
  }
  getAll(): Promise<Schedule[]> {
    throw new Error("Method not implemented.");
  }
  getById(id: string): Promise<Schedule> {
    throw new Error("Method not implemented.");
  }
  create(model: Schedule): Promise<Schedule> {
    throw new Error("Method not implemented.");
  }
  update(updatedModel: Schedule): Promise<Schedule> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
