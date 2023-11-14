import {
  Controller,
  HttpStatus,
  Req,
  Body,
  Post,
  Get,
  Param,
  Delete,
  Put,
  Res,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDTO } from 'src/user/dtos/create-schedule.dto';
import { JwtService } from '@nestjs/jwt';
import { Schedule } from 'src/schema/schedule.schema';

@Controller('schedule')
export class ScheduleController {
  constructor(
    private scheduleService: ScheduleService,
    private jwtService: JwtService,
  ) {}

  private decodeToken(req: any) {
    return this.jwtService.decode(req.headers.authorization.split(' ')[1]);
  }

  // Create a schedule
  @Post('register')
  async createSchedule(
    @Req() req,
    @Res() response,
    @Body() createScheduleDTO: CreateScheduleDTO,
  ) {
    try {
      const decodedToken = this.decodeToken(req);
      const userId = decodedToken?.user?.id;

      const newSchedule = await this.scheduleService.create(
        userId,
        createScheduleDTO,
      );
      return response.status(HttpStatus.CREATED).json({
        msg: 'Schedule created successfully',
        newSchedule,
      });
    } catch (error) {
      return response.status(error.status).json(error.message);
    }
  }

  // Get all schedules of logged in user
  @Get()
  async findAll(@Req() req, @Res() response) {
    try {
      const decodedToken = this.decodeToken(req);
      const userId = decodedToken?.user?.id;
      const userSchedules = await this.scheduleService.findAll(userId);

      return response.status(HttpStatus.OK).json({
        msg: 'All user schedules fetched successfully',
        userSchedules,
      });
    } catch (error) {
      return response.status(error.status).json(error.message);
    }
  }

  // Get a particular schedule of logged in user
  @Get(':id')
  async mySchedule(
    @Res() response,
    @Req() req,
    @Param('id') id: string,
  ): Promise<Schedule> {
    try {
      const decodedToken = this.decodeToken(req);
      const userId = decodedToken?.user?.id;
      const schedules = await this.scheduleService.findOne(userId, id);
      return response.status(HttpStatus.OK).json({
        msg: `Schedule with ID ${id} is fetched for ${userId}`,
        schedules,
      });
    } catch (error) {
      return response.status(error.status).json(error.message);
    }
  }

  // update s particular schedule of logged in user
  @Put(':id')
  async updateSchedule(
    @Res() response,
    @Param('id') id: string,
    @Req() req,
    @Body() updateScheduleDTO: CreateScheduleDTO,
  ): Promise<Schedule> {
    try {
      const decodedToken = this.decodeToken(req);
      const userId = decodedToken?.user?.id;

      const schedule = await this.scheduleService.update(
        userId,
        id,
        updateScheduleDTO,
      );
      console.log(schedule);
      return response.status(HttpStatus.OK).json({
        msg: 'Schedule updated successfully',
        schedule,
      });
    } catch (error) {
      return response.status(error.status).json(error.message);
    }
  }

  // Delete a particular schedule of logged in user
  @Delete(':id')
  async deleteSchedule(@Res() response, @Req() req, @Param('id') id: string) {
    try {
      const decodedToken = await this.decodeToken(req);
      const userId = await decodedToken?.user?.id;
      const deletedSchedule = await this.scheduleService.delete(userId, id);
      console.log(deletedSchedule);
      return response.status(HttpStatus.OK).json({
        msg: `Schedule with ID ${id} has been deleted successfully`,
        deletedSchedule,
      });
    } catch (error) {
      return response.status(error.status).json(error.message);
    }
  }
}
