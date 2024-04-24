import { ObjectValidationPipe } from "@app/my-library/pipe/validation.pipe";
import { TokenService } from "@app/my-library/token/service/token.service";
import { Body, Controller, InternalServerErrorException, Logger, Post, UseGuards } from "@nestjs/common";
import { UsersAttedanceService } from "./auth.service";
import { UserCodeConfirmDto, UserCreateValidatorDto, UserLoginDto, UserloginDataResponse } from "./dto/authentication.dto";
import { hashPassword } from "@app/my-library/function/password.function";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { registrationAttedanceValidator } from "./validator/validator";
import { AuthenticationEvent } from "src/authentication/event/authentication.event";
import { Confirm2FACodePipe, LoginUserPipe, RegistrationAttedancePipe } from "./pipe/pipe";
import { Op } from "sequelize";

import { UserTokenDecorator } from "@app/my-library/token/decorator/token.decorator";
import { UserTokenDto } from "@app/my-library/token/dto/token.dto";


@Controller('authenticationAttedance')
export class AuthenticatioAttedanceController {
  constructor(
    private readonly usersService: UsersAttedanceService,
    private readonly tokenService: TokenService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post('register')
  async register(
    @Body( RegistrationAttedancePipe)
    data: UserCreateValidatorDto,
  ) {
    try {
      // TODO: Restrict setting to administrator account only.
      let firstName;
      let lastName;
      const {
        email,
        fullName,
        password,
        department,
  
      } = data;

      if (fullName.split(' ').length === 2) {
        firstName = fullName.split(' ')[0];
        lastName = fullName.split(' ')[1];
      } else {
        firstName = fullName.split(' ')[0];
        lastName = fullName.split(' ')[2];
      }
  

      const user = await this.usersService.initialize({
        email: email.toLowerCase(),
        firstName: firstName,
        lastName: lastName,
        password: await hashPassword(password),
        department:department,
       
      });

      await user.save();
      console.log('sjsjsjs',user.email)
     
      const emailData = {
        username: user.firstName + ' ' + user.lastName,
        subject: 'Email Verification Code',
        email: data.email,
        receiver: user.id,
      };
      this.eventEmitter.emitAsync(
        AuthenticationEvent.SEND_REGISTRATION_CONFIRMAION_OTP,
        emailData,
      );
      const token = await this.tokenService.tokenize({
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });

      // TODO: send account verification email
      return {
        message: 'Registration successful.',
        data: { id: user.id },
        token,
      };
    } catch (error) {
      console.log('error', error);
      Logger.log('error', error);
      throw new InternalServerErrorException('Smething unexpected happened');
    }
  }
  @Post('login')
  async login(
    @Body( LoginUserPipe) userLogin: UserLoginDto,) {
    const user = await this.usersService.findOne({
      where: {
        email: {
          [Op.iLike]: userLogin.email,
        },
      },
    });
    const token = await this.tokenService.tokenize({
      data: {
        id: user.id,
        email: userLogin.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
    
    if (userLogin.registrationToken) {
      await this.usersService.findByIdAndUpdate(user.id, {
        registrationToken: userLogin.registrationToken,
      });
    }
  /*  if (user.FactorAuth) {
      user.validFactorAuth = false;
      await user.save();
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
    }
    */
    user.validFactorAuth = false;
    await user.save();
    const emailData = {
      username: user.firstName + ' ' + user.lastName,
      subject: '2FA Verification Code',
      email: user.email,
      receiver: user.id,
    };
   const ab = this.eventEmitter.emitAsync(
      AuthenticationEvent.SEND_2FA_VERIFICATION_CODE_1,
      emailData,
    );
    console.log('iicicic',ab)
 /*   if (user.registrationToken) {
      const pushNotificationData = {
        title: 'ACCOUN LOGIN NOTIFICATION!!!',
        body: `Hi Vesti! Please be informed that your account was accessed on ${this.usersService.dateFormatterWithTime(
          new Date(),
        )}. If not, secure your account now.`,
        token: user.registrationToken,
      };
      this.eventEmitter.emitAsync(
        PushNotificationEvents.SEND_LOGIN_NOTIFICATION,
        pushNotificationData,
      );
    }
    */
    const response:UserloginDataResponse = {
      id: user.id,
      email: user.email,
      factorAuth: user.FactorAuth,
      profilePictureURL: user.profilePictureURL,
      firstName: user.firstName,
      lastName: user.lastName,
 
    };
    return {
      message: 'Successfully logged in',
      user: response,
      token,
    };
  }

  @Post('confirm-2fa')
  @UseGuards()
  async confirm2FA(
    @Body( Confirm2FACodePipe)
    userCode:  UserCodeConfirmDto,
    @UserTokenDecorator() token: UserTokenDto,
  ) {
    try{
   const user = await this.usersService.findByIdAndUpdate(token.id, {
      validFactorAuth: true,
    });
    console.log('ab',token.email)
    
   /* const user = await this.usersService.findOne({
      where: { id:userCode.id },
    });

    */
    //console.log('ioio',token.id)
    return {
      message: 'OTP confirmed successfully',
    };
  }catch{
    return {
      message: 'Failed to confirm OTP. Please verify your code and try again.',
    };
  }}

  
}