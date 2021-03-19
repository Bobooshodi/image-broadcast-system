import { inject, injectable } from "inversify";
import { Mapper } from "@nartc/automapper";
import { getRepository } from "typeorm";

import { ServiceInterfaceTypes } from "../service-container/ServiceTypes";
import { RecipientListEntity, ScheduleEntity } from "../entities";
import { ScheduleServiceInterface } from "./interfaces/ScheduleServiceInterface";
import { Schedule } from "../models";

@injectable()
export class ScheduleService implements ScheduleServiceInterface {
  private repository = getRepository(ScheduleEntity);
  private recipientListRepo = getRepository(RecipientListEntity);

  async createAndSave(
    message: string,
    date: string,
    recipientsList: string[]
  ): Promise<Schedule> {
    const schedule = new ScheduleEntity();
    schedule.scheduledTime = new Date(date);
    schedule.message = message;
    schedule.recipientsList = [];

    for (const element of recipientsList) {
      try {
        const recipientListEntity = await this.recipientListRepo.findOne({
          uuid: element,
        });

        schedule.recipientsList.push(recipientListEntity);
      } catch (ex) {}
    }

    const savedSchedule = await this.repository.save(schedule);

    return Mapper.map(savedSchedule, Schedule);
  }
  async getAllPaginated(): Promise<any> {
    const allSchedules = await this.repository
      .createQueryBuilder("schedule")
      .paginate();
    const result = {
      ...allSchedules,
      data: Mapper.mapArray(allSchedules.data, Schedule),
    };

    return result;
  }
  async getByQuery(query: {}): Promise<Schedule[]> {
    const searchResult = await this.repository.find(query);

    return Mapper.mapArray(searchResult, Schedule);
  }
  async getPaginatedByQuery(query: {}): Promise<any> {
    throw new Error("Method not implemented.");
  }
  async getAll(): Promise<Schedule[]> {
    const allSchedules = await this.repository.find();

    return Mapper.mapArray(allSchedules, Schedule);
  }
  async getById(id: string): Promise<Schedule> {
    const scheduleEntity = await this.repository.findOne({ uuid: id });

    if (!scheduleEntity) {
      throw new Error(`Schedule with id ${id} not found`);
    }

    return Mapper.map(scheduleEntity, Schedule);
  }
  async create(model: Schedule): Promise<Schedule> {
    const entity = Mapper.map(model, ScheduleEntity);
    const res = await this.repository.save(entity);
    return Mapper.map(res, Schedule);
  }
  update(updatedModel: Schedule): Promise<Schedule> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
