import { Expose, Transform } from "class-transformer";
import dayjs from 'dayjs';

/**
 * Consumption data for a time block.
 */
export class ConsumptionData {
  // ORIGINAL FIELDS:
  cups: string;
  date: Date;
  time: string;
  consumptionKWh: number;
  obtainMethod: string;
  surplusEnergyKWh: number;

  // ADDED FIELDS:
  @Expose()
  @Transform(({obj}) => (obj.date && obj.time) ? dayjs(`${obj.date} ${obj.time}`, 'YYYY/MM/DD HH:mm', 'es').toDate() : null)
  when: Date;
}