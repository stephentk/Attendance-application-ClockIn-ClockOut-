// db.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SequelizeModuleOptions,
  SequelizeOptionsFactory,
} from '@nestjs/sequelize';

import { Otp } from 'src/otp/model/otp.model';
import { UsersAttedance } from 'src/clockin/auth/auth.model';
import { Timesheet } from 'src/clockin/timesheet/timesheet.model';
import { TimesheetGuest } from 'src/clockin/timesheetGuest/timesheetGuest.model';
import {AppConfigs} from 'src/app-config/model/app-config.model'

@Injectable()
export class DbService implements SequelizeOptionsFactory {
  constructor(private configService: ConfigService) {}

  createSequelizeOptions(): SequelizeModuleOptions {
    return {
      dialect: 'postgres',
      host: this.configService.get('POSTGRES_DB_HOST'),
      port: this.configService.get<number>('POSTGRES_DB_PORT'),
      username: this.configService.get('POSTGRES_DB_USER'),
      password: this.configService.get('POSTGRES_DB_PASSWORD'),
      database: this.configService.get('DB_NAME'),
      models: [
        Otp,
        AppConfigs,
        UsersAttedance,
        Timesheet,
        TimesheetGuest
      ],
    };
  }
}
