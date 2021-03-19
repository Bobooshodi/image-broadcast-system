import { inject, injectable } from "inversify";
import { AxiosResponse } from "axios";
import {
  SMSAPIRequest,
  SMSRequestResponse,
  SMSStatusCheckResponse,
} from "../models";
import { ServiceInterfaceTypes } from "../service-container/ServiceTypes";
import { HTTPRequestInterface } from "./interfaces/HTTPRequestInterface";
import { LoggerServiceInterface } from "./interfaces/LoggerServiceInterface";
import { SMSGatewayAPIServiceInterface } from "./interfaces/SMSGatewayAPIServiceInterface";

@injectable()
export class SMSGatewayAPIService implements SMSGatewayAPIServiceInterface {
  private logger;
  private httpService: HTTPRequestInterface;
  private baseUrl = process.env.SMS_GATEWAY_HOST;

  public constructor(
    @inject(ServiceInterfaceTypes.ServiceTypes.loggerService)
    logger: LoggerServiceInterface,
    @inject(ServiceInterfaceTypes.ServiceTypes.httpRequestService)
    httpService: HTTPRequestInterface
  ) {
    this.logger = logger.getLogger();
    this.httpService = httpService;
  }

  async send(body: SMSAPIRequest): Promise<SMSRequestResponse> {
    try {
      const res:
        | any
        | AxiosResponse = await this.httpService.postAsync<SMSRequestResponse>(
        body,
        `${this.baseUrl}/api`
      );

      return res.data;
    } catch (err) {
      this.logger.info(err);
    }
  }
  async checkStatus(recipientId: string): Promise<SMSStatusCheckResponse> {
    try {
      const params = new URLSearchParams([["messageId", recipientId]]);

      const res:
        | any
        | AxiosResponse = await this.httpService.getAsync<SMSStatusCheckResponse>(
        `${this.baseUrl}/api`,
        { params }
      );

      return res.data;
    } catch (err) {
      this.logger.info(err);
    }
  }
}
