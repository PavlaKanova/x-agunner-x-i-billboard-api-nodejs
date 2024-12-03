export const INCREMENT_COUNT_STORAGE = Symbol('IncrementCountStorage');

export interface IncrementCountStorage {
  incrementCount(incrementBy: number): Promise<void>;
}
