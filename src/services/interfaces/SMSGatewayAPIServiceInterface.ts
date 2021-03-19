import {
  SMSAPIRequest,
  SMSRequestResponse,
  SMSStatusCheckResponse,
} from "../../models";

export interface SMSGatewayAPIServiceInterface {
  send(request: SMSAPIRequest): Promise<SMSRequestResponse>;
  checkStatus(recipientId: string): Promise<SMSStatusCheckResponse>;
}
