import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Schedule, ScheduleDocument } from 'src/schema/schedule.schema';
import { CreateScheduleDTO } from 'src/user/dtos/create-schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel('Schedule') private scheduleModel: Model<ScheduleDocument>,
    private readonly jwtService: JwtService,
  ) {}

  // Logic to create a schedule
  async create(
    userId: string,
    createScheduleDto: CreateScheduleDTO,
  ): Promise<Schedule> {
    const { title, startTime, endTime, reminderTime } = createScheduleDto;

    const newSchedule = await new this.scheduleModel({
      title,
      startTime,
      endTime,
      reminderTime,
      user: userId,
    });

    const scheduler = await newSchedule.save();
    console.log(scheduler.user);
    return scheduler;
  }

  // Logic to find all schedules of a particular user
  async findAll(userId: string): Promise<Schedule[]> {
    const allSchedule = await this.scheduleModel.find({ user: userId }).exec();
    if (!allSchedule) {
      throw new NotFoundException('Schedules can not be found');
    }
    // console.log(allSchedule);
    return allSchedule;
  }

  // Logic to find a schedule from all the schedules of a particular user
  async findOne(userId: string, scheduleId: string): Promise<Schedule> {
    console.log('id:', userId);
    const schedule = await this.scheduleModel
      .findOne({ user: userId, _id: scheduleId })
      .exec();
    console.log('schedule:', schedule);
    if (!schedule) {
      throw new NotFoundException(`No Schedules with ID: ${scheduleId} found`);
    }
    return schedule;
  }

  // Logic to update a specific schedule from the schedules of a user
  async update(
    userId: string,
    scheduleId: string,
    updateScheduleDTO: CreateScheduleDTO,
  ): Promise<Schedule> {
    const { title, startTime, endTime, reminderTime } = updateScheduleDTO;

    const updatedSchedule = await this.scheduleModel.findOneAndUpdate(
      {
        user: userId,
        _id: scheduleId,
      },
      { title, startTime, endTime, reminderTime },
      { new: true },
    );

    if (!updatedSchedule) {
      throw new NotFoundException('Schedule not found');
    }

    return updatedSchedule;
  }

  // Logic to delete a specific schedule from the schedules of a specific user
  async delete(userId: string, scheduleId: string) {
    // const result = await this.scheduleModel.deleteOne({user:userId, _id:scheduleId})
    const result = await this.scheduleModel.findByIdAndDelete({
      user: userId,
      _id: scheduleId,
    });

    if (!result) {
      throw new NotFoundException('Schedule not found');
    }

    return result;
  }
}
