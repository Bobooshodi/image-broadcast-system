import { inject, injectable } from "inversify";
import Disqueue from "disqueue-node";

import { ServiceInterfaceTypes } from "../service-container/ServiceTypes";
import { LoggerServiceInterface } from "./interfaces/LoggerServiceInterface";
import { JobServiceInterface } from "./interfaces/JobServiceInterface";

@injectable()
export class DisqueService implements JobServiceInterface {
  private logger;
  private disque;

  public constructor(
    @inject(ServiceInterfaceTypes.ServiceTypes.loggerService)
    logger: LoggerServiceInterface
  ) {
    this.logger = logger.getLogger();
    this.disque = new Disqueue();
  }
  async queueJob(
    jobDetails: any,
    queue: string,
    callback: any
  ): Promise<boolean> {
    try {
      this.disque.addJob({ queue, job: jobDetails }, callback);

      return true;
    } catch (err) {
      throw err;
    }
  }

  connect(options: any, onError, onSuccess): void {
    const disqueue = new Disqueue(options);

    disqueue.on("error", (error: string) => {
      this.logger.info("Disque server is unable to connect - %s", error);

      onError(error);
    });

    disqueue.on("connected", () => {
      this.logger.info("Disque server is connected.");

      onSuccess();
    });
  }
}
