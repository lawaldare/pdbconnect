/** Helper for running potentially time-consuming "refresh" actions (e.g. canvas draw) in a non-blocking way.
 * If the caller calls `requestRefresh()`, this call returns immediately but it is guaranteed
 * that `refresh` will be run asynchronously in the future.
 * If the caller calls `requestRefresh()` multiple times, it is NOT guaranteed
 * that `refresh` will be run the same number of times, only that it will be run
 * at least once after the last call to `requestRefresh()`. */
export interface Refresher {
  requestRefresh: () => void;
}
export declare function Refresher(refresh: () => void): Refresher;
/** Sleep for `ms` milliseconds. */
export declare function sleep(ms: number): Promise<void>;
/** Return the last element of `array`, or `undefined` if there are no elements.
 * If `predicate` is provided, return the last element where `predicate` returns true,
 * or `undefined` if there is no such element. */
export declare function last<T>(array: T[], predicate?: (value: T, index: number, obj: T[]) => boolean): T | undefined;
/** Return index of the first element of `sortedArray` for which `key(element) >= query`.
 * Return length of `sortedArray` if `key(element) < query` for all elements.
 * (aka Return the first index where `query` could be inserted while keeping the array sorted.) */
export declare function firstGteqIndex<T>(sortedArray: ArrayLike<T>, query: number, key: (element: T) => number): number;
/** Data structure for storing integer intervals (ranges) and efficiently retrieving a subset of ranges which overlap with another (query) interval.
 * Not suited for storing float intervals, but query interval can be float. */
export declare class RangeCollection<T> {
  protected readonly items: T[];
  protected readonly starts: number[];
  protected readonly stops: number[];
  /** Keys to `this.bins`, sorted in ascending order */
  protected readonly binSpans: number[];
  /** `this.bins[span]` contains indices of all items whose length is `<= span` but `> span/Q`, in ascending order */
  protected readonly bins: Record<number, number[]>;
  /** Ratio of spans of neighboring bins */
  protected readonly Q = 2;
  /** Reusable arrays (one for each bin), to avoid repeated array allocation */
  private readonly _tmpArrays;
  /** Create a new collection of ranges. `start` must return range start (inclusive), `stop` must return range end (exclusive) */
  constructor(
    items: T[],
    accessors: {
      start: (item: T) => number;
      stop: (item: T) => number;
    }
  );
  /** Return number of items. */
  size(): number;
  /** Get all ranges that overlap with interval [start, stop).
   * Does not preserve original order of the ranges!
   * Instead sorts the ranges by their start (ranges with the same start are sorted by decreasing length). */
  overlappingItems(start: number, stop: number): T[];
  /** Get indices of all ranges that overlap with interval [start, stop).
   * Does not preserve original order of the ranges!
   * Instead sorts the ranges by their start (ranges with the same start are sorted by decreasing length). */
  overlappingItemIndices(start: number, stop: number): number[];
  private overlappingItemIndicesInBin;
  /** Console.log info about this RangeCollection */
  print(): void;
  /** Compare function used to sort ranges. Sorts by start, if start equal longer range goes first. */
  private readonly compareFn;
}
//# sourceMappingURL=utils.d.ts.map
