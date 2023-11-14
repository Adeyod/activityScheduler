import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateScheduleDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsDateString()
  startTime: Date;

  @IsNotEmpty()
  @IsDateString()
  endTime: Date;

  @IsNotEmpty()
  @IsDateString()
  reminderTime: Date;
}
