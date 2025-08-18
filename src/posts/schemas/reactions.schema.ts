import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, SchemaTypes } from 'mongoose';
import { User } from 'src/users/schemas/users.schema';
import { Post } from 'src/posts/schemas/posts.schema';
import { Comment } from 'src/posts/schemas/comments.schema';
import { Reactions } from 'src/posts/enums/reaction.enum';

@Schema({ timestamps: true })
export class Reaction {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, refPath: 'entityType', required: true })
  entityId: Types.ObjectId;

  @Prop({
    type: String,
    enum: [Post.name, Comment.name],
    required: true,
  })
  entityType: string;

  @Prop({
    type: String,
    enum: Reactions,
    required: true,
  })
  type: string;
}
export const ReactionSchema = SchemaFactory.createForClass(Reaction);
