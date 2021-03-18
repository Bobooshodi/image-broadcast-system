import { inject, injectable } from "inversify";
import { Mapper } from "@nartc/automapper";
import { getRepository } from "typeorm";

import { ServiceInterfaceTypes } from "../service-container/ServiceTypes";
import {
  RecipientListEntity,
  RecipientListItemEntity,
  ScheduleEntity,
} from "../entities";
import { RecipientList, RecipientListItem, Schedule } from "../models";
import { RecipientListServiceInterface } from "./interfaces/RecipientListServiceInterface";

@injectable()
export class RecipientListService implements RecipientListServiceInterface {
  private repository = getRepository(RecipientListEntity);
  private recipientListItemRepository = getRepository(RecipientListItemEntity);

  async createAndSave(name: string, recipients: []): Promise<RecipientList> {
    const recipientList = new RecipientListEntity();
    recipientList.name = name;
    recipientList.recipients = [];

    recipients.forEach((element) => {
      const recipient = new RecipientListItemEntity();
      recipient.phoneNumber = element;
      recipient.masterList = recipientList;

      recipientList.recipients.push(recipient);
    });

    await this.repository.save(recipientList);

    return Mapper.map(recipientList, RecipientList);
  }

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

  async getAllPaginated(): Promise<any> {
    const queryResult = await this.repository
      .createQueryBuilder("recipientList")
      .paginate();
    return {
      ...queryResult,
      data: Mapper.mapArray(queryResult.data, RecipientList),
    };
  }

  async getPaginatedRecipientsList(id: string): Promise<any> {
    const queryResult = await this.recipientListItemRepository
      .createQueryBuilder("recipient")
      .leftJoin("recipient.masterList", "recipientList")
      .where("recipientList.uuid = :id", { id })
      .paginate();

    return {
      ...queryResult,
      data: Mapper.mapArray(queryResult.data, RecipientListItem),
    };
  }

  getByQuery(query: {}): Promise<RecipientList[]> {
    throw new Error("Method not implemented.");
  }
  getPaginatedByQuery(query: {}): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
