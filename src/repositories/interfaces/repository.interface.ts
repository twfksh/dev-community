export interface IRepository<T> {
    create(item: Partial<T>): Promise<T>;
    findAll(filter?: any, options?: { page?: number; limit?: number; sort?: any }): Promise<T[]>;
    findById(id: string): Promise<T | null>;
    update(id: string, item: Partial<T>): Promise<T | null>;
    delete(id: string, soft?: boolean): Promise<T | null>;
    query?(params: any): Promise<any>;
}
