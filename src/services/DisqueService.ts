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
    this.disque = new Disqueue(options);

    this.disque.on("error", (error: string) => {
      this.logger.info("Disque server is unable to connect - %s", error);

      onError(error);
    });

    this.disque.on("connected", () => {
      this.logger.info("Disque server is connected.");

      onSuccess();
    });
  }

  getJobs(queue: string) {
    return new Promise((resolve, reject) => {
      this.disque.getJob({ queue }, (error, jobs) => {
        if (error) {
          reject(error);
        } else {
          jobs.forEach((job) => {
            const jobBody = JSON.parse(job.body);
            const { type } = jobBody;

            this.logger.info("Job received - %s (%s)", type, job.jobId);
          });
        }

        resolve(
          jobs.map((job) => ({
            ...job,
            ack: (callback = async () => {}) =>
              this.disque.fastAck(job.jobId, callback),
            nack: (callback = () => {}) =>
              this.disque.nack(job.jobId, callback),
          }))
        );
      });
    });
  }
}
