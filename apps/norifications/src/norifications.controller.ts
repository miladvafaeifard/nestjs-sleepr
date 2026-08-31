import { Controller, Get } from '@nestjs/common';
import { NorificationsService } from './norifications.service';

@Controller()
export class NorificationsController {
  constructor(private readonly norificationsService: NorificationsService) {}

  @Get()
  getHello(): string {
    return this.norificationsService.getHello();
  }
}
