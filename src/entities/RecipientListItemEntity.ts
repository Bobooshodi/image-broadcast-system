import { AutoMap } from "@nartc/automapper";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { IdentityEntity } from "./common/IdentityEntity";
import { RecipientListEntity } from "./RecipientListEntity";
import { ScheduleRecipientStatusEntity } from "./ScheduleRecipientStatusEntity";

@Entity({ name: "recipient_list_items" })
export class RecipientListItemEntity extends IdentityEntity {
  @ManyToOne(() => RecipientListEntity, (master) => master.recipients)
  masterList: RecipientListEntity;

  @AutoMap()
  @Column({ type: "varchar", nullable: false })
  phoneNumber: string;

  @AutoMap()
  @OneToMany(() => ScheduleRecipientStatusEntity, (status) => status.recipient)
  statuses: ScheduleRecipientStatusEntity[];
}
