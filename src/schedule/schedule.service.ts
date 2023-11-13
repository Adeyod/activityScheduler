// import { Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Schedule, ScheduleDocument } from 'src/schema/schedule.schema';
// import { CreateScheduleDTO } from 'src/user/dtos/create-schedule.dto';

// @Injectable()
// export class ScheduleService {
//   constructor(
//     @InjectModel('Schedule') private scheduleModel: Model<ScheduleDocument>,
//     private readonly jwtService: JwtService,
//   ) {}

//   async create(userId: string, createScheduleDto: CreateScheduleDTO): Promise<Schedule> {
//     const {title, startTime, endTime, reminderTime} = createScheduleDto
//   }
// }
