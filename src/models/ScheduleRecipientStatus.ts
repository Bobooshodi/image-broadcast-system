import { AutoMap } from "@nartc/automapper";
import { ScheduleRecipientStatus } from "../enums";

export class ScheduleMessageStatus {
  @AutoMap() id: string;

  @AutoMap() apiMessageKey: string;

  @AutoMap() deliveryTime: Date;

  @AutoMap() status: ScheduleRecipientStatus;
}
