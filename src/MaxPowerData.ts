import { Expose, Transform } from "class-transformer";
import dayjs from "dayjs";

export default class MaxPowerData {
  // ORIGINAL FIELDS:
  cups: string;
  date: string;
  time: string;
  maxPower: number;
  period: string;
  // ADDED FIELDS:
  @Expose()
  @Transform(({obj}) => (obj.date && obj.time) ? dayjs(`${obj.date} ${obj.time}`, 'YYYY/MM/DD HH:mm', 'es').toDate() : null)
  when: Date;
}