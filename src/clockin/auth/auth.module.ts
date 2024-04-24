import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Otp } from 'src/otp/model/otp.model';
import { OtpService } from 'src/otp/services/otp.service';
import { TokenService } from '@app/my-library/token/service/token.service';

import { HttpModule } from '@nestjs/axios';


import { SharedEventEmitterService } from '@app/my-library/event/shared-event-emitter.service';
import { UsersAttedanceService } from './auth.service';
import { UsersAttedance } from './auth.model';
import { AuthenticatioAttedanceController } from './auth.controller';
import { AUthenticationHandler } from 'src/clockin/handler/authentication.handler';

@Module({
  controllers: [ AuthenticatioAttedanceController],
  providers: [
    UsersAttedanceService,
    OtpService,
    TokenService,
    SharedEventEmitterService,
    AUthenticationHandler
  ],
  imports: [
    SequelizeModule.forFeature([ UsersAttedance, Otp]),
    HttpModule,
  ],
  exports: [ UsersAttedanceService],
})
export class AuthenticationAttedanceModule {}