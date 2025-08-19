import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Reaction,
  ReactionSchema,
} from 'src/reactions/schemas/reactions.schema';
import { ReactionsController } from './reactions.controller';
import { ReactionsService } from './reactions.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reaction.name, schema: ReactionSchema },
    ]),
    AuthModule,
  ],
  controllers: [ReactionsController],
  providers: [ReactionsService],
})
export class ReactionsModule {}
