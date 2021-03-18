import { inject, injectable } from "inversify";
import { Mapper } from "@nartc/automapper";
import { getRepository } from "typeorm";

import { ServiceInterfaceTypes } from "../service-container/ServiceTypes";
import { RecipientListEntity, ScheduleEntity } from "../entities";
import { ScheduleServiceInterface } from "./interfaces/ScheduleServiceInterface";
import { RecipientList, RecipientListItem, Schedule } from "../models";
import { RecipientListServiceInterface } from "./interfaces/RecipientListServiceInterface";

@injectable()
export class RecipientListService implements RecipientListServiceInterface {
  private imageRepository = getRepository(RecipientListEntity);

  getRecipientList(id: string): RecipientListItem[] {
    throw new Error("Method not implemented.");
  }
  getAll(): Promise<RecipientList[]> {
    throw new Error("Method not implemented.");
  }
  getById(id: string): Promise<RecipientList> {
    throw new Error("Method not implemented.");
  }
  create(model: RecipientList): Promise<RecipientList> {
    throw new Error("Method not implemented.");
  }
  update(updatedModel: RecipientList): Promise<RecipientList> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
