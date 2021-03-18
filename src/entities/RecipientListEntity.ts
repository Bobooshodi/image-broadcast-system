import { AutoMap } from "@nartc/automapper";
import { Column, Entity, OneToMany } from "typeorm";
import { IdentityEntity } from "./common/IdentityEntity";
import { RecipientListItemEntity } from "./RecipientListItemEntity";

@Entity({ name: "recipientLists" })
export class RecipientListEntity extends IdentityEntity {
  @AutoMap()
  @Column({ type: "varchar", nullable: false })
  name: string;

  @AutoMap()
  @OneToMany(
    () => RecipientListItemEntity,
    (recipientLists) => recipientLists.masterList
  )
  recipients: RecipientListItemEntity[];
}
