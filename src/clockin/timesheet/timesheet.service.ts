import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Timesheet } from './timesheet.model';
import { UsersAttedanceService } from '../auth/auth.service';
import { Op } from 'sequelize';
import { UsersAttedance } from '../auth/auth.model';
import { TimeSheetGuestService } from '../timesheetGuest/timesheetGuest.service';
import moment from 'moment';

@Injectable()
export class TimeSheetService {

  constructor(
    @InjectModel(Timesheet)
    private timeSheetModel: typeof Timesheet,
    @InjectModel(UsersAttedance)
     private readonly usersService: UsersAttedanceService,
     private readonly timesheetguestservice:TimeSheetGuestService
  ) {}

  async clockIn(userId: string): Promise<Timesheet> {
    try {
      // Check if the user is already clocked in
      const existingEntry = await this.timeSheetModel.findOne({
        where: {
          userId,
          clockOutTime: null, // If there is no clock out time, user is already clocked in
        },
      });
      /*

      if (existingEntry) {
        throw new Error('User is already clocked in');
      // throw new BadRequestException('User is already clocked in.');
      }
      */

      // Get the current time with only the hour and minute components
      const currentTime = new Date();
      const hour = currentTime.getHours();
      const minute = currentTime.getMinutes();

      // Create a new time sheet entry for clocking in
      const data = await this.timeSheetModel.create({
        userId,
        clockInTime: `${hour}:${minute}`,
        date: currentTime,
      });

      return data;
    } catch (error) {
      console.error('Error occurred during clock-in:', error);
      throw new Error('Failed to clock in user');
    }
  }

  async clockOut(userId: string,comment:string): Promise<Timesheet> {
    try{
    // Find the latest time sheet entry for the user that is not already clocked out
    const latestEntry = await this.timeSheetModel.findOne({
      where: {
        userId,
        clockOutTime: null,
      },
      order: [['createdAt', 'DESC']], // Get the latest entry
    });

    if (!latestEntry) {
      throw new Error('User is not clocked in');
    }
    const currentTime = new Date();
        const hour = currentTime.getHours();
        const second = currentTime.getMinutes();

    // Update the clockOutTime of the latest entry to the current date and time
    latestEntry.clockOutTime = `${hour}:${second}`
    latestEntry.comment = comment 
   const data = await latestEntry.save();
   return data;
  } catch (error) {
    console.error('Error occurred during clock-in:', error);
    throw new Error('Failed to clock in user');
  }
}

  async getUserTimeSheet(userId: string): Promise<Timesheet[]> {
    return this.timeSheetModel.findAll({
      where: { userId },
    });
  }

  async getUserTimeSheetsAdmin(): Promise<Timesheet[]> {
    return this.timeSheetModel.findAll({
      });
  }


  

  async getTimeSheetsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Timesheet[]> {
    return this.timeSheetModel.findAll({
      where: {
        userId,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    });
  }

/*async getAllUserAttendanceDetails() {
  const userTimeSheets = await this.timeSheetModel.findAll({
    //where: { userId },
    include: [
      {
        model: UsersAttedance,
        as: 'user',
        attributes: ['firstName', 'lastName', 'department', 'email'],
      },
    ],
    attributes: ['date', 'clockInTime', 'clockOutTime'],
  });

  
return userTimeSheets
  
}
*/
async getAllUserAttendanceDetails(page: number, pageSize: number = 10) {
 /* const offset = (page - 1) * pageSize;

  const userTimeSheets = await this.timeSheetModel.findAll({
    include: [
      {
        model: UsersAttedance,
        as: 'user',
        attributes: ['firstName', 'lastName', 'department', 'email'],
      },
    ],
    attributes: ['date', 'clockInTime', 'clockOutTime'],
    limit: pageSize,
    offset: offset,
  });
console.log('here',userTimeSheets)
  return userTimeSheets;
  */

  const offset = (page - 1) * pageSize;

  const { count, rows } = await this.timeSheetModel.findAndCountAll({
    include: [
      {
        model: UsersAttedance,
        as: 'user',
        attributes: ['firstName', 'lastName', 'department', 'email'],
      },
    ],
    attributes: ['date', 'clockInTime', 'clockOutTime'],
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

/*async getUserAttendanceDetailsBySearch(firstName: string, department: string) {
 
   const userTimeSheets = await this.timeSheetModel.findAll({
     include: [
       {
         model: UsersAttedance,
         as: 'user',
         attributes: ['firstName', 'lastName', 'department', 'email'],
         where: {
           firstName,
           department,
         },
       },
     ],
     attributes: ['date', 'clockInTime', 'clockOutTime'],
   });
 
   return userTimeSheets;
 }
 */
 /*async getUserAttendanceDetailsBySearch(
  firstName: string,
  department: string,
  week: string,
  month: string,
  //clockInTime: string,
  //clockOutTime: string,
) {
  const whereClause: any = {};
  const whereClauseDate:any = {}
  
  // Filter by first name and department
  if (firstName) {
    whereClause.firstName = firstName;
  }
  if (department) {
    whereClause.department = department;
  }

  // Additional filters
  if (week === "thisWeek") {
    
    const startOfWeek = moment().startOf('week').toDate();
    const endOfWeek = moment().endOf('week').toDate();

    // Add date filter for the current week
    whereClauseDate.date = {
      [Op.between]: [startOfWeek, endOfWeek],
    };
  }
    // Additional filters
    if (month === "thisMonth") {
    
      const startOfMonth = moment().startOf('month').toDate();
      const endOfMonth = moment().endOf('month').toDate();
  
      // Add date filter for the current week
      whereClauseDate.date = {
        [Op.between]: [startOfMonth, endOfMonth],
      };
    }
    /* 

  if (clockInTime) {
    // Implement filter by clock-in time
  }
  if (clockOutTime) {
    // Implement filter by clock-out time
  }


  const userTimeSheets = await Timesheet.findAll({
    include: [
      {
        model: UsersAttedance,
        as: 'user',
        attributes: ['firstName', 'lastName', 'department', 'email'],
        where: whereClause,
      },
    ],
    attributes: ['date', 'clockInTime', 'clockOutTime'],
  });
*/
/*const userTimeSheets = await Timesheet.findAll({
  include: [
    {
      model: UsersAttedance,
      as: 'user',
      attributes: [],
      where: whereClause,
    },
  ],
  attributes: ['date', 'clockInTime', 'clockOutTime'],
});
*//*  const userTimeSheets = await this.usersService.findAll({
  include: [
    {
      model: Timesheet,
      attributes: ['date', 'clockInTime', 'clockOutTime'],
      where: whereClause,
    },
  ],
});


const userTimeSheets = await Timesheet.findAll({
  include: [
    {
      model: UsersAttedance,
      as: 'user',
      attributes: ['firstName', 'lastName', 'department', 'email'],
      where: whereClause,
    },
  ],
  attributes: ['date', 'clockInTime', 'clockOutTime'],
  where:whereClauseDate
});

  return userTimeSheets;
}
*/
async getUserAttendanceDetailsBySearch(
  firstName: string,
  department: string,
  week: string,
  month: string,
  clockInTime: string,
  clockOutTime:string,
  page: number, pageSize: number = 10
) {
  const whereClause: any = {};
  const whereClauseDate:any = {}

  const offset = (page - 1) * pageSize;

  // Filter by first name and department
  if (firstName) {
    whereClause.firstName = firstName;
  }
  if (department) {
    whereClause.department = department;
  }

  // Additional filters
  if (week === "thisWeek") {
    const startOfWeek = moment().startOf('week').toDate();
    const endOfWeek = moment().endOf('week').toDate();
    // Add date filter for the current week
    whereClauseDate.date = {
      [Op.between]: [startOfWeek, endOfWeek],
    };
  }

  // Additional filters
  if (month === "thisMonth") {
    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('month').toDate();
    // Add date filter for the current month
    whereClauseDate.date = {
      [Op.between]: [startOfMonth, endOfMonth],
    };
  }

  // Check if clockInTime is "select"
  if (clockInTime === "select") {
    // Select only clockInTime
  /* await Timesheet.findAll({
      include: [
        {
          model: UsersAttedance,
          as: 'user',
          attributes: ['firstName', 'lastName', 'department', 'email'],
          where: whereClause,
        },
      ],
      attributes: ['date', 'clockInTime'], // Selecting only clockInTime
      where: whereClauseDate,
    });
    */

  const { count, rows } = await this.timeSheetModel.findAndCountAll({
    include: [
      {
        model: UsersAttedance,
        as: 'user',
        attributes: ['firstName', 'lastName', 'department', 'email'],
        where: whereClause,
      },
    ],
    attributes: ['date', 'clockInTime'],
    where: whereClauseDate,
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
  }  if (clockOutTime === "select") {
    // Select only clockInTime
 
    const { count, rows } = await this.timeSheetModel.findAndCountAll({
      include: [
        {
          model: UsersAttedance,
          as: 'user',
          attributes: ['firstName', 'lastName', 'department', 'email'],
          where: whereClause,
        },
      ],
      attributes: ['date', 'clockOutTime'],
      where: whereClauseDate,
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
  } else {
    // Select all attributes
  

  const { count, rows } = await this.timeSheetModel.findAndCountAll({
    include: [
      {
        model: UsersAttedance,
        as: 'user',
        attributes: ['firstName', 'lastName', 'department', 'email'],
        where: whereClause,
      },
    ],
    attributes: ['date', 'clockInTime','clockOutTime'],
    where: whereClauseDate,
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

}
