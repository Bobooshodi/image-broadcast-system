import { AutoMap } from "@nartc/automapper";
import { Column, Entity, ManyToOne } from "typeorm";
import { IdentityEntity } from "./common/IdentityEntity";
import { RecipientListEntity } from "./RecipientListEntity";

@Entity({ name: "recipientListItems" })
export class RecipientListItemEntity extends IdentityEntity {
  @AutoMap()
  @ManyToOne(() => RecipientListEntity, (master) => master.recipients)
  masterList: RecipientListEntity;

  @AutoMap()
  @Column({ type: "varchar", nullable: false })
  phoneNumber: string;
}
