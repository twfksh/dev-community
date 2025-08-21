import { instanceToPlain, plainToClass } from "class-transformer";

/**
 * A utility class to map between entities and DTOs.
 */
export class Mapper<T, U> {
    static toDto<T, U>(entity: T, dtoClass: new () => U): U {
        const data = instanceToPlain(entity);
        return plainToClass(dtoClass, data);
    }

    static toEntity<T, U>(dto: T, entityClass: new () => U): U {
        const data = instanceToPlain(dto);
        return plainToClass(entityClass, data);
    }
}