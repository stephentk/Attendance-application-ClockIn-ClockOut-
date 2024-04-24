// time-sheet.controller.ts
import { Controller, Post, Get, Req, Res, HttpStatus, Param, Query, UseGuards, BadRequestException } from '@nestjs/common';
import {TimeSheetService} from './timesheet.service';
import { query } from 'express';
import { UserTokenDto } from '@app/my-library/token/dto/token.dto';
import { UserTokenDecorator } from '@app/my-library/token/decorator/token.decorator';
import { UsersAttedanceService } from '../auth/auth.service';
import { Op } from 'sequelize';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthenticationEvent } from 'src/authentication/event/authentication.event';
import { Timesheet } from './timesheet.model';
import { TimeSheetGuestService } from '../timesheetGuest/timesheetGuest.service';


@Controller('time-sheet')
export class TimeSheetController {
  constructor(private readonly timeSheetService: TimeSheetService,
    private readonly usersService: UsersAttedanceService,
    private readonly eventEmitter: EventEmitter2,
    private readonly timeSheetGuestService: TimeSheetGuestService) {}
  @Post('clock-in')
  async clockIn(@Req() req, @Res() res) {
    const userId = req.body.userId;
    try {
      const data = await this.timeSheetService.clockIn(userId);
      return res.status(HttpStatus.CREATED).json(data);
    } catch (error) {
      console.error('Error occurred during clock-in:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while processing the request.' });
    }
  }
  @Post('clock-out')
  async clockOut(@Req() req, @Res() res) {
    const userId = req.body.userId;
    const comment = req.body.comment;
    try {
      const data =   await this.timeSheetService.clockOut(userId,comment);
      return res.status(HttpStatus.CREATED).json(data);
    } catch (error) {
      console.error('Error occurred during clock-in:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while processing the request.' });
    }
  }
  @Get(':userId')
 async getUserTimeSheets(@Param('userId') userId: string,) {
    return this.timeSheetService.getUserTimeSheet(userId);
  }
  /*
  @Get('getList')
  async getUserTimeSheets1(
    @Query('firstName') firstName?: string,
    @Query('department') department?: string,
    @Query('week') week?: string,
    @Query('month') month?: string,
    @Query('clockInTime') clockInTime?: string,
    @Query('clockOutTime') clockOutTime?: string,
  ): Promise<Timesheet[]> {
    const searchCriteria = { firstName, department, week, month, clockInTime, clockOutTime };
    return this.timeSheetService.getUserTimeSheets( searchCriteria);
  }
*/

  @Get(':userId/filter')
  async getTimeSheetsByDateRange(
    @Param('userId') userId: string,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ) {
    return this.timeSheetService.getTimeSheetsByDateRange(userId, startDate, endDate);
  }

  @Get('admin/GetAllEmployees')
  @UseGuards()
  async adminEmployeesAll(
    @UserTokenDecorator() token: UserTokenDto,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    const user = await this.usersService.findOne({
      where: {
        email: {
          [Op.iLike]: token.email,
        },
      },
    });
    const emailData = {
      username: user.firstName + ' ' + user.lastName,
      subject: '2FA Verification Code',
      email: user.email,
      receiver: user.id,
    };
    this.eventEmitter.emitAsync(
      AuthenticationEvent.SEND_2FA_VERIFICATION_CODE_1,
      emailData,
    );
    console.log('jddnddjd',emailData)
       if (!user.validFactorAuth) {
      throw new BadRequestException('Please confirm your OTP first.');
    }
    switch (token.email) {
      case 'stephen@wevesti.com':
        console.log('udududu',token.email)
       // return this.timeSheetService.getUserTimeSheetsAdmin()
      return this.timeSheetService.getAllUserAttendanceDetails(page,pageSize)
      
      default:
        throw new BadRequestException(
          'No permission to access employee timesheet'
        );
    }}
    @Get('admin/GetEmployeesSearch')
    @UseGuards()
    async adminEmployees(
      @UserTokenDecorator() token: UserTokenDto,
      @Query('firstName') firstName: string,
      @Query('department') department: string,
      @Query('week') week?: string,
      @Query('month') month?: string,
      @Query('clockInTime') clockInTime?: string,
      @Query('clockOutTime') clockOutTime?: string,
      @Query('page') page?: number,
      @Query('pageSize') pageSize?: number,
    ) {
      const user = await this.usersService.findOne({
        where: {
          email: {
            [Op.iLike]: token.email,
          },
        },
      });
     // user.validFactorAuth = false;
      await user.save()
      const emailData = {
        username: user.firstName + ' ' + user.lastName,
        subject: '2FA Verification Code',
        email: user.email,
        receiver: user.id,
      };
      this.eventEmitter.emitAsync(
        AuthenticationEvent.SEND_2FA_VERIFICATION_CODE_1,
        emailData,
      );
         if (!user.validFactorAuth) {
        throw new BadRequestException('Please confirm your OTP first.');
      }
      
      switch (token.email) {
        case 'stephen@wevesti.com':
          console.log('udududu',token.email)
         // return this.timeSheetService.getUserTimeSheetsAdmin()
         return this.timeSheetService.getUserAttendanceDetailsBySearch(firstName,department,week,month,clockInTime,clockOutTime,page,pageSize)
        default:
          throw new BadRequestException(
            'No permission to access employee timesheet'
          );
      }}
    

  /*@Get('adminEmployees/:userId')
  @UseGuards()
  async adminEmployees1(
    @Param('userId') userId: string,
    @UserTokenDecorator() token: UserTokenDto,
  ) {
   
    switch (token.email) {
      case 'johndoe123@wevesti.com':
     return this.timeSheetService.getUserAttendanceDetails(userId);
      default:
        throw new BadRequestException(
          'No permission to access employee timesheet'
        );
      }}
      
    */
  


   }

