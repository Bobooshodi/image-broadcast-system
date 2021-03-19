import { ScheduleRecipientStatus } from "../enums";

export class SMSRequestResponse {
  dnis?: string;
  message_id: string;
}

export class SMSStatusCheckResponse {
  status: ScheduleRecipientStatus;
  delivery_time?: string;
}

export class SMSAPIRequest {
  dnis: string;
  message: string;
}
