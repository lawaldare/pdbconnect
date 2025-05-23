/** Return index of the first element of `sortedArray` for which `key(element) >= query`.
 * Return length of `sortedArray` if `key(element) < query` for all elements.
 * (aka Return the first index where `query` could be inserted while keeping the array sorted.) */
export declare function firstGteqIndex<T>(sortedArray: ArrayLike<T>, query: number, key: (element: T) => number): number;
/** Return index of the first element of `sortedArray` for which `key(element) === query`.
 * Return `undefined` if `key(element) !== query` for all elements. */
export declare function firstEqIndex<T>(sortedArray: ArrayLike<T>, query: number, key: (element: T) => number): number | undefined;
//# sourceMappingURL=binary-search.d.ts.map
