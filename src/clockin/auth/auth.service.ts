import { ModelCtor } from 'sequelize-typescript';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '@app/my-library/db/db.service';
import { Op } from 'sequelize';
import { UsersAttedance} from './auth.model';
import { UserCreateValidatorDto } from './dto/authentication.dto';

@Injectable()
export class UsersAttedanceService extends BaseService<UsersAttedance> {
  constructor(
    @InjectModel(UsersAttedance)
    private readonly userModel: ModelCtor<UsersAttedance>,
  ) {
    super(userModel);
  }

  initialize = (data: any) => {
    return new UsersAttedance(data);
  };
}