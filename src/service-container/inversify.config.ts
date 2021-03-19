import { Container } from "inversify";

import { ServiceInterfaceTypes } from "./ServiceTypes";
import {
  DisqueService,
  HTTPRequestInterface,
  HttpRequestService,
  JobServiceInterface,
  LoggerService,
  LoggerServiceInterface,
  RecipientListService,
  RecipientListServiceInterface,
  ScheduleMessageStatusService,
  ScheduleMessageStatusServiceInterface,
  ScheduleService,
  ScheduleServiceInterface,
  SMSGatewayAPIService,
  SMSGatewayAPIServiceInterface,
} from "../services";

var container = new Container();
container
  .bind<JobServiceInterface>(ServiceInterfaceTypes.ServiceTypes.jobService)
  .to(DisqueService);
container
  .bind<HTTPRequestInterface>(
    ServiceInterfaceTypes.ServiceTypes.httpRequestService
  )
  .to(HttpRequestService);
container
  .bind<SMSGatewayAPIServiceInterface>(
    ServiceInterfaceTypes.ServiceTypes.smsGatewayAPIService
  )
  .to(SMSGatewayAPIService);
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
container
  .bind<ScheduleMessageStatusServiceInterface>(
    ServiceInterfaceTypes.ServiceTypes.schedumeMessageStatusService
  )
  .to(ScheduleMessageStatusService);

export default container;
