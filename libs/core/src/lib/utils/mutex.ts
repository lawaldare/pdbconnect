/** Helper for running async actions in mutual exclusion. */
export interface Mutex {
  /** Name of the mutex (for debugging etc.) */
  name: string;
  /** Run action in mutual exclusion, i.e. await all actions previously requested via `run`, then run and await `action`, then unblock actions requested later (whether action resolved or rejected).
   * Guarantees that the actions are run in the same order as they are requested.
   * Returns promise with the result of `action`. */
  run<T>(action: () => Promise<T>): Promise<T>;
}

/** Create a `Mutex` object for running async actions in mutual exclusion. `onError` is function which is called when an action rejects (default: console warn; use `()=>{}` to just ignore rejections). */
export function Mutex(name = 'Unnamed Mutex', onErrors: (error: any) => void = console.warn): Mutex {
  let currentPromise: Promise<unknown> = Promise.resolve();
  return {
    name,
    run: (action) => {
      const resultPromise = currentPromise.then(action);
      currentPromise = resultPromise.catch(onErrors);
      return resultPromise;
    },
  };
}
