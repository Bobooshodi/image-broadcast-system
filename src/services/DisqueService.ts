import { inject, injectable } from "inversify";
import { default as Disqueue } from "disqueue-node";

import { ServiceInterfaceTypes } from "../service-container/ServiceTypes";
import { LoggerServiceInterface } from "./interfaces/LoggerServiceInterface";
import { JobServiceInterface } from "./interfaces/JobServiceInterface";

@injectable()
export class DisqueService implements JobServiceInterface {
  private logger;
  private disque = new Disqueue({
    host: process.env.DISQUE_HOST,
    port: process.env.DISQUE_PORT,
  });

  public constructor(
    @inject(ServiceInterfaceTypes.ServiceTypes.loggerService)
    logger: LoggerServiceInterface
  ) {
    this.logger = logger.getLogger();
  }

  processCheckJob(job: any) {
    const jobBody = JSON.parse(job.body);
    const { type } = jobBody;
  }
  async processCheckJobs() {
    while (true) {
      try {
        let jobs: any = await this.getJobs(process.env.QUEUE_NAME);

        this.logger.info("Received %s jobs", jobs.length);

        await Promise.all(jobs.map((job) => this.processCheckJob(job)));
      } catch (error) {
        this.logger.error("Unable to process job", error);
      }
    }
  }

  processSendJob(job: any) {
    const jobBody = JSON.parse(job.body);
    const { type } = jobBody;
  }

  async processSendJobs() {
    while (true) {
      try {
        let jobs: any = await this.getJobs(process.env.QUEUE_NAME);

        this.logger.info("Received %s jobs", jobs.length);

        await Promise.all(jobs.map((job) => this.processSendJob(job)));
      } catch (error) {
        this.logger.error("Unable to process job", error);
      }
    }
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
