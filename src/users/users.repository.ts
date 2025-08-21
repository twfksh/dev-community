import { BaseRepository } from "src/repositories/base.repository";
import { User } from "./schemas/users.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, PipelineStage } from "mongoose";

@Injectable()
export class UserRepository extends BaseRepository<User> {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
        super();
    }

    async create(item: Partial<User>): Promise<User> {
        return this.userModel.create(item);
    }

    async findAll(filter?: any, options?: { page?: number; limit?: number; sort?: any }): Promise<User[]> {
        const { page = 1, limit = 10, sort = {} } = options ?? {};
        return this.userModel
            .find({ ...filter })
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
    }

    async findById(id: string): Promise<User | null> {
        return this.userModel.findById(id).exec();
    }

    async update(id: string, item: Partial<User>): Promise<User | null> {
        return this.userModel.findByIdAndUpdate(id, item, { new: true }).exec();
    }

    async delete(id: string, soft?: boolean): Promise<User | null> {
        if (soft) {
            return this.userModel.findByIdAndUpdate(id, { deleted: true }, { new: true }).exec();
        }
        return this.userModel.findByIdAndDelete(id).exec();
    }

    query?(params: any[]): Promise<any> {
        const pipeline: PipelineStage[] = params ?? [];
        return this.userModel.aggregate(pipeline).exec();
    }
}
