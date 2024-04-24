
import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class UsersAttedance extends Model<UsersAttedance> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  firstName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  lastName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  department: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;
  
  @Column({
    defaultValue: false,
  })
  FactorAuth: boolean;


  @Column({
    defaultValue: false,
  })
  validFactorAuth: boolean;

  @Column({ type: DataType.STRING })
  FactorAuthCode: string;

  @Column({ type: DataType.STRING})
  registrationToken: string;

  @Column({ type: DataType.STRING })
  profilePictureURL: string;
}