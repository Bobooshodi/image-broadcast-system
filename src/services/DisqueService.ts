import { inject, injectable } from "inversify";
import { getConnection, getRepository } from "typeorm";
import { default as Disqueue } from "disqueue-node";

import { ServiceInterfaceTypes } from "../service-container/ServiceTypes";
import { LoggerServiceInterface } from "./interfaces/LoggerServiceInterface";
import { JobServiceInterface } from "./interfaces/JobServiceInterface";
import {
  JobQueue,
  JobType,
  ScheduleRecipientStatus,
  ScheduleStatus,
} from "../enums";
import {
  RecipientListEntity,
  RecipientListItemEntity,
  ScheduleEntity,
  ScheduleRecipientStatusEntity,
} from "../entities";
import { SMSGatewayAPIServiceInterface } from "./interfaces/SMSGatewayAPIServiceInterface";

@injectable()
export class DisqueService implements JobServiceInterface {
  private logger;
  private smsAPIService: SMSGatewayAPIServiceInterface;

  private disque = new Disqueue({
    host: process.env.DISQUE_HOST,
    port: process.env.DISQUE_PORT,
  });

  public constructor(
    @inject(ServiceInterfaceTypes.ServiceTypes.loggerService)
    logger: LoggerServiceInterface,
    @inject(ServiceInterfaceTypes.ServiceTypes.smsGatewayAPIService)
    smsAPIService: SMSGatewayAPIServiceInterface
  ) {
    this.logger = logger.getLogger();
    this.smsAPIService = smsAPIService;
  }

  async processCheckJob(job: any) {
    const jobBody = JSON.parse(job.body);
    const { messageStatus, type } = jobBody;

    try {
      if (JobType.CheckMessageStatus !== type) {
        throw new Error("Wrong Type");
      }

      const messageStatusRepo = getRepository(ScheduleRecipientStatusEntity);

      let recipientMessageStatus = await messageStatusRepo.findOne({
        uuid: messageStatus.uuid,
      });

      const smsGatewayResponse = await this.smsAPIService.checkStatus(
        messageStatus.messageIdentifier
      );

      recipientMessageStatus.status = smsGatewayResponse.status;
      recipientMessageStatus.deliveryTime = !!smsGatewayResponse.delivery_time
        ? new Date(smsGatewayResponse.delivery_time)
        : undefined;

      recipientMessageStatus = await messageStatusRepo.save(
        recipientMessageStatus
      );

      if (ScheduleRecipientStatus.Accepted === smsGatewayResponse.status) {
        await this.queueJob(
          JSON.stringify({
            recipientMessageStatus,
            type: JobType.CheckMessageStatus,
          }),
          JobQueue.CheckQueue,
          (err, JobDetails) => {
            if (err) {
              this.logger.error(
                `Unable to queue Message Checking for MessageDetails #${recipientMessageStatus.uuid}. ERROR REASON ${err}`
              );
            } else {
              this.logger.info(
                `Message Checking for MessageDetails #${recipientMessageStatus.uuid} Queued Again Successfully. JOB DETAILS ${JobDetails}`
              );
            }
          }
        );
      } else {
        this.logger.info(
          `Messsage from Schedule #${messageStatus.schedule.uuid} for Recipient#${messageStatus.recipient.uuid} Ended`
        );
      }

      job.ack();
    } catch (err) {
      this.logger.error(
        `Unable to check status of message for Recipient #${messageStatus.recipient.uuid} for Schedule #${messageStatus.schedule.uuid}. ERROR REASON ${err}`
      );
    }
  }
  async processCheckJobs() {
    while (true) {
      try {
        let jobs: any = await this.getJobs(JobQueue.CheckQueue);

        this.logger.info("Received %s jobs", jobs.length);

        await Promise.all(jobs.map((job) => this.processCheckJob(job)));
      } catch (error) {
        this.logger.error("Unable to process job", error);
      }
    }
  }

  async processSendJob(job: any) {
    const jobBody = JSON.parse(job.body);
    const { recipientId, schedule, type } = jobBody;

    try {
      if (JobType.SendMessage !== type) {
        throw new Error("Wrong Type");
      }

      const recipientRepo = getRepository(RecipientListItemEntity);
      const messageStatusRepo = getRepository(ScheduleRecipientStatusEntity);

      const recipientDetails = await recipientRepo.findOne({
        uuid: recipientId,
      });

      const smsGatewayResponse = await this.smsAPIService.send({
        dnis: recipientDetails.phoneNumber,
        message: schedule.message,
      });

      let messageStatus = new ScheduleRecipientStatusEntity();
      messageStatus.messageIdentifier = smsGatewayResponse.message_id;
      messageStatus.recipient = recipientDetails;
      messageStatus.schedule = schedule;

      messageStatus = await messageStatusRepo.save(messageStatus);

      await this.queueJob(
        JSON.stringify({
          messageStatus,
          type: JobType.CheckMessageStatus,
        }),
        JobQueue.CheckQueue,
        (err, JobDetails) => {
          if (err) {
            this.logger.error(
              `Unable to queue Message Checking for MessageDetails #${messageStatus.uuid} from Recipient #${recipientId} for Schedule #${schedule.uuid}. ERROR REASON ${err}`
            );
          } else {
            this.logger.info(
              `Message Checking for MessageDetails #${messageStatus.uuid} for Recipient #${recipientId} from Schedule #${schedule.uuid} Queued Successfully. JOB DETAILS ${JobDetails}`
            );
          }
        }
      );

      this.logger.info(
        `Messsage from Schedule #${schedule.uuid} sent to Recipient#${recipientId}`
      );

      job.ack();
    } catch (err) {
      this.logger.error(
        `Unable to Send message to Recipient #${recipientId} for Schedule #${schedule.uuid}. ERROR REASON ${err}`
      );
    }
  }

  async processSendJobs() {
    while (true) {
      try {
        let jobs: any = await this.getJobs(JobQueue.SendQueue);

        this.logger.info("Received %s jobs", jobs.length);

        await Promise.all(jobs.map((job) => this.processSendJob(job)));
      } catch (error) {
        this.logger.error("Unable to process job", error);
      }
    }
  }

  async processScheduleJob(job: any) {
    const jobBody = JSON.parse(job.body);
    const { scheduleId, type } = jobBody;

    try {
      if (JobType.ProcessMessage !== type) {
        throw new Error("Wrong Type");
      }

      const scheduleRepo = getRepository(ScheduleEntity);

      const schedule = await scheduleRepo.findOne(
        { uuid: scheduleId },
        { relations: ["recipientsList"] }
      );

      for (let list of schedule.recipientsList) {
        list.recipients = await getConnection()
          .createQueryBuilder()
          .relation(RecipientListEntity, "recipients")
          .of(list)
          .loadMany();

        for (let i = 0; i < list.recipients.length; i++) {
          await this.queueJob(
            JSON.stringify({
              recipientId: list.recipients[i].uuid,
              schedule,
              type: JobType.SendMessage,
            }),
            JobQueue.SendQueue,
            (err, JobDetails) => {
              if (err) {
                this.logger.error(
                  `Unable to queue Send Job Queued for Recipient #${list.recipients[i].uuid} for Schedule #${scheduleId}. ERROR REASON ${err}`
                );
              } else {
                this.logger.info(
                  `Send Job Queued for Recipient #${list.recipients[i].uuid} for Schedule #${scheduleId}. JOB DETAILS ${JobDetails}`
                );
              }
            }
          );
        }
      }

      schedule.status = ScheduleStatus.Running;
      await scheduleRepo.save(schedule);

      this.logger.info(`Schedule #${schedule.uuid} Proccessed Successfully`);

      job.ack();
    } catch (err) {
      this.logger.error(
        `Unable to process Schedule #${scheduleId}. ERROR REASON ${err}`
      );
    }
  }

  async processScheduleJobs() {
    while (true) {
      try {
        let jobs: any = await this.getJobs(JobQueue.ProcessQueue);

        this.logger.info(
          "Received %s jobs on %s",
          jobs.length,
          JobQueue.ProcessQueue
        );

        await Promise.all(jobs.map((job) => this.processScheduleJob(job)));
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
