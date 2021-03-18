import { AutoMap } from "@nartc/automapper";
import { IdentityModel } from "./common/IdentityModel";

export class RecipientListItem extends IdentityModel {
  @AutoMap() phoneNumber: string;
}
