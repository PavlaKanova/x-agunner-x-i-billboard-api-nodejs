export const REQUEST_CONTENT_STORAGE = Symbol('RequestContentStorage');

export interface RequestContentStorage {
  append(content: string): Promise<void>;
}
