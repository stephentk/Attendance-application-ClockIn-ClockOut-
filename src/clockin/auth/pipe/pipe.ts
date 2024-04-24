import {
    BadRequestException,
    ConflictException,
    ExecutionContext,
    Injectable,
    Logger,
    NotFoundException,
    PipeTransform,
    UnauthorizedException,
  } from '@nestjs/common';
  import {
    
    UserCodeConfirmDto,
    UserCreateValidatorDto, UserLoginDto,
  } from '../dto/authentication.dto';
  import { Op, Sequelize } from 'sequelize';
  import { verifyPassword } from '@app/my-library/function/password.function';
 
  import { CountryEnum } from '@app/my-library/enum/country.enum';
  import { OtpService } from 'src/otp/services/otp.service';
  import { OtpTypeEnum } from 'src/otp/enums/otp.enum';
import { UsersAttedanceService } from '../auth.service';
  
  @Injectable()
  export class RegistrationAttedancePipe implements PipeTransform {
    constructor(private readonly usersService:  UsersAttedanceService) {}
  
    async transform(user: UserCreateValidatorDto) {
      const existingEmail = await this.usersService.propExists({
        where: {
          email: {
            [Op.iLike]: user.email,
          },
        },
      });
      if (existingEmail) {
        throw new ConflictException('Email already registered');
      }
  
      return user;
    }
  }

  @Injectable()
export class LoginUserPipe implements PipeTransform {
  constructor(
    private readonly usersService:  UsersAttedanceService
  ) {}

  async transform(userLogin: UserLoginDto) {
    const { email, password } = userLogin;
    const user = await this.usersService.findOne({
      where: {
        email: {
          [Op.iLike]: email,
        },
      },
      attributes: {
        include: ['password'],
      },
    });
    if (!user) {
      throw new ConflictException('Invalid credentials');
    }

    if (!user.password)
      throw new BadRequestException('Please reset your password to continue');
    const confirmPassword = await verifyPassword(password, user.password);
    if (!confirmPassword) {
      throw new ConflictException('Invalid credentials');
    }

    return userLogin;
  }
}


@Injectable()
export class Confirm2FACodePipe implements PipeTransform {
  constructor(
    private readonly usersService:  UsersAttedanceService,
    private readonly otpService: OtpService,
  ) {}

  async transform(userCode: UserCodeConfirmDto) {
    const { code, id } = userCode;
    const user = await this.usersService.findOne({
      where: { id: id},
      attributes: {
        include: ['password'],
      },
    });
    if (!user) {
      throw new BadRequestException(
        'It appears that the code or account you provided is not valid. Please verify and try again',
      );
    }
    const otp = await this.otpService.findOne({
      where: { type: OtpTypeEnum.Email, receiver: user.id },
    });
    if (!otp) {
      throw new BadRequestException(
        'It appears that the code or account you provided is not valid. Please verify and try again',
      );
    }
   const verifyOtp = await this.otpService.verify({
      code,
      receiver: user.id,
      type: OtpTypeEnum.Email,
      id: otp.id,
    });
    if (!verifyOtp) {
      throw new BadRequestException(
        'It appears that the code or account you provided is not valid. Please verify and try again',
      );
    }
    return userCode;
  }
  
}