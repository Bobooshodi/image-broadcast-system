export interface AbstractHTTPRequestInterface<T> {
  getAll<T>(): Promise<T[]>;
  get<T>(id: string): Promise<T>;
  update<T>(updatedObject: T): Promise<T>;
  create<T>(newObject: T): Promise<T>;
  delete<T>(id: string): Promise<T>;
}
