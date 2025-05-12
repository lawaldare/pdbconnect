import { Injectable } from '@angular/core';

type QueueItem = {
  name: string;
  fn: () => Promise<any>;
  skippable: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class ActionQueueService {
  private queue: QueueItem[] = [];
  private processing = false;

  public addAction(name: string, fn: () => Promise<any>, skippable = true) {
    this.queue.push({ name, fn, skippable });
    this.processNext();
  }

  private async processNext() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      // Keep all unskippable actions, and only the last skippable
      const nextQueue: QueueItem[] = [];
      let lastSkippable: QueueItem | null = null;

      for (const item of this.queue) {
        if (item.skippable) {
          lastSkippable = item; // Only keep the latest skippable
        } else {
          nextQueue.push(item); // Keep all unskippable
        }
      }

      // If we have a skippable action, add only the last one
      if (lastSkippable) {
        nextQueue.push(lastSkippable);
      }

      // Replace the queue with filtered items
      this.queue = nextQueue;

      const action = this.queue.shift(); // Remove the next one to process
      if (!action) break;

      // console.log(`Processing action: ${action.name}`);
      await action.fn();
      // console.log(`Finished action: ${action.name}`);
    }

    this.processing = false;
  }
}
