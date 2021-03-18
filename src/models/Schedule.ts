import { AutoMap } from "@nartc/automapper";
import { ScheduleStatus } from "../enums";
import { IdentityModel } from "./common/IdentityModel";
import { RecipientList } from "./RecipientList";

export class Schedule extends IdentityModel {
  @AutoMap() message: string;

  @AutoMap(() => RecipientList) recipientsList: RecipientList[];

  @AutoMap() scheduledTime: Date;

  @AutoMap() status: ScheduleStatus;
}
