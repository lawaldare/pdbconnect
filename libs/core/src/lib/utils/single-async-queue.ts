/** Job queue that allows at most one running and one pending job.
 * A newly enqueued job will cancel any other pending jobs. */
export class SingleAsyncQueue {
  private isRunning: boolean;
  private queue: { id: number; func: () => any }[];
  private counter: number;
  private log: boolean;
  constructor(log = false) {
    this.isRunning = false;
    this.queue = [];
    this.counter = 0;
    this.log = log;
  }
  enqueue(job: () => any) {
    if (this.log) console.log('SingleAsyncQueue enqueue', this.counter);
    this.queue[0] = { id: this.counter, func: job };
    this.counter++;
    this.run(); // do not await
  }
  /** This allows enqueuing multiple jobs within a short time (`throttleMs`) and only running the last job, `throttleMs` after the first job was enqueued.
   * (Without throttling, the first and the last job would run).
   * Usefull for events like user typing (not having to run a job after each keystroke). */
  enqueueWithThrottle(throttleMs: number, job: () => any) {
    this.enqueue(() => sleep(throttleMs));
    this.enqueue(job);
  }
  private async run() {
    if (this.isRunning) return;
    const job = this.queue.pop();
    if (!job) return;
    this.isRunning = true;
    try {
      if (this.log) console.log('SingleAsyncQueue run', job.id);
      await job.func();
      if (this.log) console.log('SingleAsyncQueue complete', job.id);
    } finally {
      this.isRunning = false;
      this.run();
    }
  }
}

function sleep(timeMs: number) {
  return new Promise((resolve) => setTimeout(resolve, timeMs));
}
