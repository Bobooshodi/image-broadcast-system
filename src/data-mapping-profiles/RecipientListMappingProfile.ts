import { AutoMapper, mapFrom, ProfileBase } from "@nartc/automapper";
import { RecipientListEntity } from "../entities";
import { RecipientList } from "../models";

export class RecipientListMappingProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper
      .createMap(RecipientListEntity, RecipientList)
      .forMember(
        (m) => m.id,
        mapFrom((src) => src.uuid)
      )
      .reverseMap();
  }
}
