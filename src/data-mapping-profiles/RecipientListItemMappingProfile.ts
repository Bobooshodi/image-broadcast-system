import { AutoMapper, mapFrom, ProfileBase } from "@nartc/automapper";
import { RecipientListEntity } from "../entities";
import { RecipientList } from "../models";

export class RecipientListItemMappingProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(RecipientListEntity, RecipientList).reverseMap();
  }
}
