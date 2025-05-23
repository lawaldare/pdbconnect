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
    const actionsInQueue = this.queue.map((act) => act.name);
    if (actionsInQueue.indexOf(name) > -1) return;
    this.queue.push({ name, fn, skippable });
    this.processNext();
  }

  private async processNext() {
    if (this.processing) return;
    this.processing = true;

    // Take a snapshot of current queue
    const currentQueue = [...this.queue];
    this.queue = []; // Clear immediately to avoid race condition

    // Step 1: Keep all unskippable actions, and only the last skippable
    const nextQueue: QueueItem[] = [];
    let lastSkippable: QueueItem | null = null;

    for (const item of currentQueue) {
      if (item.skippable) {
        lastSkippable = item;
      } else {
        nextQueue.push(item);
      }
    }

    if (lastSkippable) {
      nextQueue.push(lastSkippable);
    }

    // Step 2: deduplicate by name (keep last)
    const seen = new Set<string>();
    const dedupedQueue: QueueItem[] = [];

    for (let i = nextQueue.length - 1; i >= 0; i--) {
      const item = nextQueue[i];
      if (!seen.has(item.name)) {
        seen.add(item.name);
        dedupedQueue.unshift(item); // maintain order
      }
    }

    // Step 3: Execute actions
    for (const action of dedupedQueue) {
      // console.log(`Processing action: ${action.name}`);
      await action.fn();
      // console.log(`Finished action: ${action.name}`);
    }

    this.processing = false;

    // In case new items were added to `this.queue` during execution
    if (this.queue.length > 0) {
      this.processNext(); // schedule next batch
    }
  }
}
