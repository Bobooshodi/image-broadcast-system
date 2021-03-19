import { AutoMap } from "@nartc/automapper";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { ScheduleRecipientStatus } from "../enums";
import { IdentityEntity } from "./common/IdentityEntity";
import { RecipientListItemEntity } from "./RecipientListItemEntity";
import { ScheduleEntity } from "./ScheduleEntity";

@Entity({ name: "schedule_recipient_statuses" })
export class ScheduleRecipientStatusEntity extends IdentityEntity {
  @AutoMap()
  @ManyToOne(
    () => RecipientListItemEntity,
    (recipientListItem) => recipientListItem.statuses,
    {
      cascade: true,
    }
  )
  recipient: RecipientListItemEntity;

  @AutoMap()
  @ManyToOne(() => ScheduleEntity, (schedule) => schedule.recipientStatuses, {
    cascade: true,
  })
  schedule: ScheduleEntity;

  @AutoMap()
  @Column({
    type: "enum",
    enum: ScheduleRecipientStatus,
    default: ScheduleRecipientStatus.Sent,
  })
  status: ScheduleRecipientStatus;
}
