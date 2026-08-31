import { Injectable } from '@nestjs/common';

@Injectable()
export class NorificationsService {
  getHello(): string {
    return 'Hello World!';
  }
}
