export interface AbstractInterface<T> {
  getAll(): Promise<T[]>;
  getAllPaginated(): Promise<any>;
  getById(id: string): Promise<T>;
  getByQuery(query: {}): Promise<T[]>;
  getPaginatedByQuery(query: {}): Promise<any>;
  create(model: T): Promise<T>;
  update(updatedModel: T): Promise<T>;
  delete(id: string): Promise<boolean>;
}
