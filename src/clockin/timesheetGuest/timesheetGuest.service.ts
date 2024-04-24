import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TimesheetGuest } from './timesheetGuest.model';
import moment from 'moment';
import { Op } from 'sequelize';

@Injectable()
export class TimeSheetGuestService {
  constructor(
    @InjectModel(TimesheetGuest)
    private timeSheetGuestModel: typeof TimesheetGuest,
  ) {}

  async Guest_RegistrationForm(Name: string,purposeOfVisit:string,phoneNumber:string,employeeName:string): Promise<TimesheetGuest> {

        // Get the current time with only the hour and second components
        const currentTime = new Date();
        const hour = currentTime.getHours();
        const second = currentTime.getMinutes();


    
    const data = await this.timeSheetGuestModel.create({
      
      Time: `${hour}:${second}`,
      date: currentTime,
      phoneNumber,
      purposeOfVisit,
      employeeName,
      Name
      });
      return data

  } 
  async getGuestTimeSheet(week: string, month: string, page: number, pageSize: number): Promise<{
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    records: TimesheetGuest[];
  }> {
    const whereClause: any = {};
    const offset = (page - 1) * pageSize;
  
    // Filter by week
    if (week === 'thisWeek') {
      const startOfLastSevenDays = moment().subtract(7, 'days').startOf('day').toDate();
      whereClause.date = {
        [Op.between]: [startOfLastSevenDays, new Date()],
      };
    }
    if (week === 'lastWeek') {
      const startOfLastWeek = moment().subtract(1, 'week').startOf('isoWeek').toDate();
      const endOfLastWeek = moment().subtract(1, 'week').endOf('isoWeek').toDate();
      whereClause.date = {
        [Op.between]: [startOfLastWeek, endOfLastWeek],
      };
    }
  
    // Filter by month
    if (month === 'thisMonth') {
      const startOfMonth = moment().month(month).startOf('month').toDate();
      const endOfMonth = moment().month(month).endOf('month').toDate();
      whereClause.date = {
        [Op.between]: [startOfMonth, endOfMonth],
      };
    }
  
    const { count, rows } = await this.timeSheetGuestModel.findAndCountAll({
      where: whereClause,
      limit: pageSize,
      offset: offset,
    });
  
    return {
      totalRecords: count,
      totalPages: Math.ceil(count / pageSize),
      currentPage: page,
      pageSize: pageSize,
    records: rows,
    };
  }
  
}