import { SequelizeModule } from '@nestjs/sequelize';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TimeSheetController } from './timesheet.controller';
import { Timesheet } from './timesheet.model';
import { UsersAttedance } from '../auth/auth.model';
import { UsersAttedanceService } from '../auth/auth.service';
import { TimeSheetService } from './timesheet.service';
import { TimeSheetGuestService } from '../timesheetGuest/timesheetGuest.service';
import { TimesheetGuest } from '../timesheetGuest/timesheetGuest.model';

@Module({
  controllers: [TimeSheetController],
  providers: [TimeSheetService , UsersAttedanceService, TimeSheetGuestService],
  imports: [HttpModule, SequelizeModule.forFeature([Timesheet, UsersAttedance,TimesheetGuest])],
  exports: [TimeSheetService, TimeSheetGuestService],
})
export class timesheetModule {}
