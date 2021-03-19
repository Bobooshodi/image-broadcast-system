export interface JobServiceInterface {
  connect(options, onError, onSuccess);
  queueJob(jobDetails, queue, callback): Promise<boolean>;
  processSendJob(job);
  processCheckJob(job);
  processSendJobs();
  processCheckJobs();
  processScheduleJob(job);
  processScheduleJobs();
}
