import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/health')
  getHealth(): string {
    if (this.appService.isMongooseConnected()) {
      return 'OK';
    }
    return 'Mongoose is not connected';
  }
}
