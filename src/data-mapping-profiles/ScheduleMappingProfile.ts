import { AutoMapper, ignore, mapFrom, ProfileBase } from "@nartc/automapper";
import { ScheduleEntity } from "../entities";
import { Schedule } from "../models";

export class ScheduleMappingProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper
      .createMap(ScheduleEntity, Schedule)
      .forMember(
        (m) => m.id,
        mapFrom((src) => src.uuid)
      )
      .forMember(
        (m) => m.dateCreated,
        mapFrom((src) => src.dateCreated)
      )
      .forMember(
        (m) => m.dateUpdated,
        mapFrom((src) => src.dateUpdated)
      )
      .reverseMap();
  }
}
