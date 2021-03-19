import { AutoMapper, mapFrom, ProfileBase } from "@nartc/automapper";
import { RecipientListItemEntity } from "../entities";
import { RecipientListItem } from "../models";

export class RecipientListItemMappingProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(RecipientListItemEntity, RecipientListItem).reverseMap();
  }
}
