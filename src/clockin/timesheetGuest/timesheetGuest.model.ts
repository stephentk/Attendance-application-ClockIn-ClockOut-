import { Table, Column, Model, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';



@Table
export class TimesheetGuest extends Model<TimesheetGuest> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
      })
  id: string;

  @Column
  Name: string;



  @Column
  phoneNumber: string;

  @Column
  employeeName: string;


  @Column
  purposeOfVisit: string;
  
  @Column
  Time: string;

  
  @Column
  date: Date;
}
