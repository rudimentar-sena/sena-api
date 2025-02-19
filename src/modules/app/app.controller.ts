import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggerService } from '../logger/logger.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: LoggerService,
  ) {}

  @Get()
  getHello(): string {
    this.logger.log('Handling getHello request');
    return this.appService.getHello();
  }
}
