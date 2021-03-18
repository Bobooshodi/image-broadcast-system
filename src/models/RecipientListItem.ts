import { AutoMap } from "@nartc/automapper";
import { IdentityModel } from "./common/IdentityModel";

export class RecipientListItem {
  @AutoMap() phoneNumber: string;
}
