import { Container } from "inversify";

import { ServiceInterfaceTypes } from "./ServiceTypes";
import {
  RecipientListService,
  RecipientListServiceInterface,
  ScheduleService,
  ScheduleServiceInterface,
} from "../services";

var container = new Container();
container
  .bind<RecipientListServiceInterface>(
    ServiceInterfaceTypes.ServiceTypes.recipientListService
  )
  .to(RecipientListService);
container
  .bind<ScheduleServiceInterface>(
    ServiceInterfaceTypes.ServiceTypes.sheduleService
  )
  .to(ScheduleService);

export default container;
