import { getCustomRepository } from "typeorm";
import { Schedule, ScheduleMessageStatus } from "../../models";

import { AbstractInterface } from "./common/AbstractInterface";

export interface ScheduleMessageStatusServiceInterface
  extends AbstractInterface<ScheduleMessageStatus> {
  getByScheduleId(scheduleId: string);
}
