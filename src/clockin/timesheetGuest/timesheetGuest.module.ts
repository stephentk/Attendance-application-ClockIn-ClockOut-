import { SequelizeModule } from '@nestjs/sequelize';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TimeSheetGuestController } from './timesheetGuest.controller';
import { TimeSheetGuestService } from './timesheetGuest.service';
import { TimesheetGuest } from './timesheetGuest.model';
import { UsersAttedanceService } from '../auth/auth.service';
import { UsersAttedance } from '../auth/auth.model';

@Module({
  controllers: [TimeSheetGuestController],
  providers: [TimeSheetGuestService,UsersAttedanceService ],
  imports: [HttpModule, SequelizeModule.forFeature([TimesheetGuest,UsersAttedance])],
  exports: [TimeSheetGuestService,UsersAttedanceService ],
})
export class timesheetGuestModule {}
