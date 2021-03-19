import { AutoMapper, ignore, mapFrom, ProfileBase } from "@nartc/automapper";
import { ScheduleRecipientStatusEntity } from "../entities";
import { ScheduleMessageStatus } from "../models";

export class ScheduleRecipientStatusMappingProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper
      .createMap(ScheduleRecipientStatusEntity, ScheduleMessageStatus)
      .forMember(
        (m) => m.id,
        mapFrom((src) => src.uuid)
      )
      .forMember(
        (m) => m.apiMessageKey,
        mapFrom((src) => src.messageIdentifier)
      )
      .reverseMap();
  }
}
