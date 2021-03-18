export interface JobServiceInterface {
  connect(options, onError, onSuccess);
  queueJob(jobDetails, queue, callback): Promise<boolean>;
}
