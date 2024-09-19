import { Expose, Transform, Type } from "class-transformer";
import dayjs from 'dayjs';
import Supply from "./Supply";

export class ConsumptionDataItem {
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

export class ConsumptionData {
  supply: Supply;
  startDate: Date;
  endDate: Date;
  measurementType: 0|1;
  @Type(() => ConsumptionDataItem)
  data: ConsumptionDataItem[];

  constructor(supply: Supply, startDate: Date, endDate: Date, measurementType: 0|1, data: ConsumptionDataItem[]) {
    this.supply = supply;
    this.startDate = startDate;
    this.endDate = endDate;
    this.measurementType = measurementType;
    this.data = data;
  }
}