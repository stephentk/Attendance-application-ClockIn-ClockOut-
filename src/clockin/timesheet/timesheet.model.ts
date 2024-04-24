import { Table, Column, Model, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import { UsersAttedance } from '../auth/auth.model';


@Table
export class Timesheet extends Model<Timesheet> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
      })
  id: string;
  
  @Column
  date: Date;

  @Column
  clockInTime: string;

  @Column
  clockOutTime: string;

  @Column
  comment: string;

  @ForeignKey(() => UsersAttedance)
  @Column({
    type: DataType.UUID, 
    allowNull: false
})
  userId: string;

  @BelongsTo(() => UsersAttedance, {
    foreignKey: 'userId',
    as: 'user',
  })
  user: UsersAttedance;
}
