import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, ConnectionStates } from 'mongoose';

@Injectable()
export class AppService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  getHello(): string {
    return 'Hello World!';
  }

  isMongooseConnected(): boolean {
    return this.connection.readyState === ConnectionStates.connected;
  }
}
