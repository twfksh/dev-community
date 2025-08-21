import { BaseRepository } from "src/repositories/base.repository";
import { Post } from "./schemas/posts.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model, PipelineStage } from "mongoose";

export class PostRepository extends BaseRepository<Post> {
    constructor(@InjectModel(Post.name) private readonly postModel: Model<Post>) {
        super();
    }
    create(item: Partial<Post>): Promise<Post> {
        return this.postModel.create(item);
    }
    findAll(filter?: any, options?: { page?: number; limit?: number; sort?: any; }): Promise<Post[]> {
        const { page = 1, limit = 10, sort = { createdAt: -1 } } = options || {};
        return this.postModel.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).exec();
    }
    findById(id: string): Promise<Post | null> {
        return this.postModel.findById(id).exec();
    }
    update(id: string, item: Partial<Post>): Promise<Post | null> {
        return this.postModel.findByIdAndUpdate(id, item, { new: true }).exec();
    }
    delete(id: string, soft?: boolean): Promise<Post | null> {
        if (soft) {
            return this.postModel.findByIdAndUpdate(id, { deleted: true }, { new: true }).exec();
        }
        return this.postModel.findByIdAndDelete(id).exec();
    }
    query?(params: any[]): Promise<any> {
        const pipeline: PipelineStage[] = params ?? [];
        return this.postModel.aggregate(pipeline).exec();
    }
}