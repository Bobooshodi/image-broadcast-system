export class SMSRequestResponse {
  dnis?: string;
  message_id: string;
}

export class SMSStatusCheckResponse {
  status: string;
  delivery_time?: string;
}

export class SMSAPIRequest {
  dnis: string;
  message: string;
}
