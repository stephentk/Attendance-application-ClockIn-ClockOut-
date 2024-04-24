// time-sheet.controller.ts
import { Controller, Post, Get, Req, Res, HttpStatus, Param, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { query } from 'express';
import { TimeSheetGuestService } from './timesheetGuest.service';
import { UserTokenDto } from '@app/my-library/token/dto/token.dto';
import { UserTokenDecorator } from '@app/my-library/token/decorator/token.decorator';
import { UsersAttedanceService } from '../auth/auth.service';
import { Op } from 'sequelize';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthenticationEvent } from 'src/authentication/event/authentication.event';

@Controller('time-sheetGuest')
export class TimeSheetGuestController {
  constructor(private readonly timeSheetGuestService: TimeSheetGuestService,
    private readonly usersService: UsersAttedanceService,
    private readonly eventEmitter: EventEmitter2,) {}

  @Post('registration')
  async clockIn(@Req() req, @Res() res) {

    const Name = req.body.Name;
    const purposeOfVisit = req.body.purposeOfVisit;
    const phoneNumber = req.body.phoneNumber;
    const employeeName = req.body.employeeName
    try{
   const data =  await this.timeSheetGuestService.Guest_RegistrationForm(Name,purposeOfVisit,phoneNumber,employeeName);
   return res.status(HttpStatus.CREATED).json(data);
    }catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while processing the request.' }); 
    }
   
  }

 
  @Get('adminGuestsSheet')
  @UseGuards()
  async adminEmployees(
    @UserTokenDecorator() token: UserTokenDto,
    @Query('week') week?: string,
    @Query('month') month?: string,
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
        return this.timeSheetGuestService.getGuestTimeSheet(week,month,page,pageSize);
      default:
        throw new BadRequestException(
          'No permission to access employee timesheet'
        );
    }}

}
