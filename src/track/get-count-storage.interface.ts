export const GET_COUNT_STORAGE = Symbol('GetCountStorage');

export interface GetCountStorage {
  getCount(): Promise<number>;
}
