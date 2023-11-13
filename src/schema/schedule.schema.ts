import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './user.schema';

export type ScheduleDocument = Schedule & Document;

@Schema({ timestamps: true })
export class Schedule {
  @Prop()
  title: string;

  @Prop()
  startTime: Date;

  @Prop()
  endTime: Date;

  @Prop()
  reminderTime: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
