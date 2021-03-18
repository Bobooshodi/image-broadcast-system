import { AutoMap } from "@nartc/automapper";
import { IdentityModel } from "./common/IdentityModel";

export class RecipientList extends IdentityModel {
  @AutoMap() name: string;
}
