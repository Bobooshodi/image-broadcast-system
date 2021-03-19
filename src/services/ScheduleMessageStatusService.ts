import { Mapper } from "@nartc/automapper";
import { injectable } from "inversify";
import { getRepository } from "typeorm";
import { ScheduleRecipientStatusEntity } from "../entities";
import { ScheduleMessageStatus } from "../models";
import { ScheduleMessageStatusServiceInterface } from "./interfaces/ScheduleMessageStatusServiceInterface";

@injectable()
export class ScheduleMessageStatusService
  implements ScheduleMessageStatusServiceInterface {
  private repository = getRepository(ScheduleRecipientStatusEntity);

  async getByScheduleId(scheduleId: string) {
    const messageStatuses = await this.repository
      .createQueryBuilder("messageStatus")
      .leftJoin("messageStatus.schedule", "schedule")
      .where("schedule.uuid = :id", { id: scheduleId })
      .paginate();

    return {
      ...messageStatuses,
      data: Mapper.mapArray(messageStatuses.data, ScheduleMessageStatus),
    };
  }
  getAll(): Promise<ScheduleMessageStatus[]> {
    throw new Error("Method not implemented.");
  }
  getAllPaginated(): Promise<any> {
    throw new Error("Method not implemented.");
  }
  getById(id: string): Promise<ScheduleMessageStatus> {
    throw new Error("Method not implemented.");
  }
  getByQuery(query: {}): Promise<ScheduleMessageStatus[]> {
    throw new Error("Method not implemented.");
  }
  getPaginatedByQuery(query: {}): Promise<any> {
    throw new Error("Method not implemented.");
  }
  create(model: ScheduleMessageStatus): Promise<ScheduleMessageStatus> {
    throw new Error("Method not implemented.");
  }
  update(updatedModel: ScheduleMessageStatus): Promise<ScheduleMessageStatus> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
