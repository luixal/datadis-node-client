import { Expose, Transform } from "class-transformer";
import dayjs from "dayjs";
import { Distributor } from "./Distributor";

export default class Supply {
  // ORIGINAL FIELDS:
  address: string;
  cups: string;
  postalCode: string;
  province: string;
  municipality: string;
  distributor: string;
  validDateFrom: Date;
  validDateTo: Date;
  pointType: number;
  distributorCode: string;
  // ADDED FIELDS:
  @Expose()
  @Transform(({value}) => value ? dayjs(value, 'YYYY/MM/DD', 'es').toDate() : null)
  validFrom: Date;
  @Expose()
  @Transform(({value}) => value ? dayjs(value, 'YYYY/MM/DD', 'es').toDate() : null)
  validTo: Date;
  @Expose()
  @Transform(({obj}) => obj.distributorCode ? new Distributor(obj.distributorCode) : null)
  distributorObj: Distributor;
}