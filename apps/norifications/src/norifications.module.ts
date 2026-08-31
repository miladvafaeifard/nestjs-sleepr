import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@app/common';
import Joi from 'joi';

import { NorificationsController } from './norifications.controller';
import { NorificationsService } from './norifications.service';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NORIFICATIONS_PORT: Joi.number().required(),
      }),
    }),
  ],
  controllers: [NorificationsController],
  providers: [NorificationsService],
})
export class NorificationsModule {}
