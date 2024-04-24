import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { UserTokenMiddleware } from '@app/my-library/guards/auth.guard';
import { OtpModule } from './otp/otp.module';
import { envValidator } from './env/validator/env.validator';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './db/db.module';
import { LoggerModule } from './logger/logger.module';
import { AuthenticationAttedanceModule } from './clockin/auth/auth.module';
import { timesheetModule } from './clockin/timesheet/timesheet.module';
import { timesheetGuestModule } from './clockin/timesheetGuest/timesheetGuest.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';
import { MulterConfigService } from '@app/my-library/validator/multer.validator';
import { AppConfigModule } from './app-config/app-config.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MulterModule } from '@nestjs/platform-express';
import { TokenModule } from '@app/my-library/token/token.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      validationSchema: envValidator,
    }),
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      ignoreErrors: false,
    }),
    MulterModule.registerAsync({
      useClass: MulterConfigService,
      // storage: multerStorage,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('QUEUE_HOST'),
          port: configService.get('QUEUE_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    LoggerModule,
    TokenModule,
    OtpModule,
    EmailModule,
    AppConfigModule,
    AuthenticationAttedanceModule,
    timesheetModule,
    timesheetGuestModule,
  
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    return consumer
      .apply(UserTokenMiddleware)
      .exclude(
        '',
        'authenticationAttedance/register',
        'authenticationAttedance/login',
        'time-sheetGuest/registration',
        'time-sheetGuest/getList',


    
      
      )
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
  }
}
/*
import { BullModule } from '@nestjs/bull';
import { MulterConfigService } from '@app/my-library/validator/multer.validator';
import { AppConfigModule } from './app-config/app-config.module';
import { ScheduleModule } from '@nestjs/schedule';
import { FirebaseModule } from './firebase/firebase.module';
import { MulterModule } from '@nestjs/platform-express';
import { EventEmitterModule } from '@nestjs/event-emitter';
*/