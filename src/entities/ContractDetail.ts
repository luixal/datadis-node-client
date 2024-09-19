import { Transform } from "class-transformer";
import dayjs from "dayjs";

export default class ContractDetail {
  cups: string;
  distributor: string;
  marketer: string;
  tension: string;
  accessFare: string;
  province: string;
  municipality: string;
  postalCode: string;
  contractedPowerkW: number[];
  timeDiscrimination: string;
  modePowerControl: string;
  @Transform(({value}) => value ? dayjs(value, 'YYYY/MM/DD', 'es').toDate() : null)
  startDate: Date;
  @Transform(({value}) => value ? dayjs(value, 'YYYY/MM/DD', 'es').toDate() : null)
  endDate: Date;
  codeFare: string;
  selfConsumptionTypeCode: string;
  selfConsumptionTypeDesc: string;
  section: string;
  subsection: string;
  partitionCoefficient: number;
  cau: string;
  installedCapacity: number
}