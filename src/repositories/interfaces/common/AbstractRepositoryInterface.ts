export interface AbstractRepositoryInterface<T> {
    findById(id: string): Promise<T>;
    createAndSave(entity: T): Promise<T>;
}