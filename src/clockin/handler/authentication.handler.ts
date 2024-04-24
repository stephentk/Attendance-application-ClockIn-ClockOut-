import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from 'src/email/service/email.service';
import { OtpService } from 'src/otp/services/otp.service';
import { AuthenticationEvent } from '../../authentication/event/authentication.event';
import { EmailTemplateIdEnum } from 'src/email/enum/email.enum';
import { OtpTypeEnum } from 'src/otp/enums/otp.enum';

import {  SendEmailOtpDto} from 'src/authentication/dto/sendEmail.dto'

@Injectable()
export class AUthenticationHandler {
  constructor(
    private readonly otpService: OtpService,
    private readonly emailService: EmailService,

  ) {}

  @OnEvent(AuthenticationEvent.SEND_REGISTRATION_CONFIRMAION_OTP)
  async sendRegistrationConfirmation(data: SendEmailOtpDto) {
    data.template = EmailTemplateIdEnum.verificationCode;
    data.type = OtpTypeEnum.EmailConfirmation;
    await this.sendEmailWithOtp(data);
  }

  @OnEvent(AuthenticationEvent.SEND_2FA_VERIFICATION_CODE_1)
  async send2FaVerificationCode(data: SendEmailOtpDto) {
    data.template = EmailTemplateIdEnum.verificationCode;
    data.type = OtpTypeEnum.Email;
    await this.sendEmailWithOtp(data);
  }

  @OnEvent(AuthenticationEvent.SEND_PASSWORD_RESET_MAIL)
  async sendPasswordResetCode(data: SendEmailOtpDto) {
    data.template = EmailTemplateIdEnum.verificationCode;
    data.type = OtpTypeEnum.Email;
    await this.sendEmailWithOtp(data);
  }

  async sendEmailWithOtp(data: SendEmailOtpDto) {
    try {
      const generatedCode = await this.otpService.generateCode(
        data.receiver,
        data.type,
      );

      await this.emailService.send({
        to: data.email,
        template: data.template,
        subject: data.subject,
        body: {
          title: data.title,
          username: data.username,
          code: generatedCode.code,
          body: data.message,
        },
      });
    } catch (error) {
      console.log(error);
      Logger.error({
        type: 'otp-email-notification-error',
        error,
      });
    }
  }


}
