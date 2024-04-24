import { EmailTemplateIdEnum } from "src/email/enum/email.enum";
import { OtpTypeEnum } from "src/otp/enums/otp.enum";

export class SendEmailOtpDto {
    receiver: string;
    email: string;
    type: OtpTypeEnum;
    username: string;
    title: string;
    code?: string;
    subject: string;
    message: string;
    template?: EmailTemplateIdEnum;
    cc?: string[];
    role?: string;
    link?: string;
  }
  