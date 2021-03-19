export let ServiceInterfaceTypes = {
  ServiceTypes: {
    httpRequestService: Symbol("HTTPRequestServiceInterface"),
    jobService: Symbol("JobServiceInterface"),
    loggerService: Symbol("LoggerServiceInterface"),
    recipientListService: Symbol("RecipientListServiceInterface"),
    sheduleService: Symbol("SheduleServiceInterface"),
    smsGatewayAPIService: Symbol("SMSGatewayAPIServiceInterface"),
    schedumeMessageStatusService: Symbol(
      "ScheduleMessageStatusServiceInterface"
    ),
  },
  RepositoryTypes: {},
};
