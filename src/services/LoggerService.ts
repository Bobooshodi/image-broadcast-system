import { injectable } from "inversify";
import pino from "pino";
import { LoggerServiceInterface } from "./interfaces/LoggerServiceInterface";

@injectable()
export class LoggerService implements LoggerServiceInterface {
  private logger = pino();

  getLogger() {
    return this.logger;
  }
}
