import { getCustomRepository } from "typeorm";
import { Schedule } from "../../models";

import { AbstractInterface } from "./common/AbstractInterface";

export interface ScheduleServiceInterface extends AbstractInterface<Schedule> {
  createAndSave(
    message: string,
    date: string,
    recipientsList: string[]
  ): Promise<Schedule>;
}
