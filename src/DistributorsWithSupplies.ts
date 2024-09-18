import { Expose, Transform } from "class-transformer";
import { Distributor } from "./Distributor";

export default class DistributorsWithSupplies {
  distributorCodes: string[];
  @Expose()
  @Transform(({obj}) => obj.distributorCodes.map( (c:string) => new Distributor(c) ))
  distributors: Distributor[]
}