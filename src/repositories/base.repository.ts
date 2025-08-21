import { IRepository } from "./interfaces/repository.interface";

export abstract class BaseRepository<T> implements IRepository<T> {
    abstract create(item: Partial<T>): Promise<T>;
    abstract findAll(filter?: any, options?: { page?: number; limit?: number; sort?: any }): Promise<T[]>;
    abstract findById(id: string): Promise<T | null>;
    abstract update(id: string, item: Partial<T>): Promise<T | null>;
    abstract delete(id: string, soft?: boolean): Promise<T | null>;
    abstract query?(params: any): Promise<any>;
}
