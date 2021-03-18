import { Container } from "inversify";

import { ServiceInterfaceTypes } from "./ServiceTypes";
import {
  DisqueService,
  JobServiceInterface,
  LoggerService,
  LoggerServiceInterface,
  RecipientListService,
  RecipientListServiceInterface,
  ScheduleService,
  ScheduleServiceInterface,
} from "../services";

var container = new Container();
container
  .bind<JobServiceInterface>(ServiceInterfaceTypes.ServiceTypes.jobService)
  .to(DisqueService);
container
  .bind<LoggerServiceInterface>(
    ServiceInterfaceTypes.ServiceTypes.loggerService
  )
  .to(LoggerService);
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
