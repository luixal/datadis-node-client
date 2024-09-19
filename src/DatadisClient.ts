import axios, { AxiosInstance, isAxiosError } from "axios";
import { plainToInstance } from "class-transformer";
import * as qs from 'qs';
import "reflect-metadata";

import Account from "./entities/Account";
import { ConsumptionData } from "./entities/ConsumptionData";
import ContractDetail from "./entities/ContractDetail";
import DistributorsWithSupplies from "./entities/DistributorsWithSupplies";
import MaxPowerData from "./entities/MaxPowerData";
import Supply from "./entities/Supply";
import { DatadisAPIError, DatadisAuthError, DatadisError } from "./utils/DatadisError";
import { BASE_URL, Endpoints } from "./utils/Urls";
import { formatDateToYearAndMonthOnly } from "./utils/Utils";

/**
 * Datadis API Client
 */
export default class DatadisClient {
  /** {@link Account} created with the username and password provided in the constructor. */
  private account: Account;
  private _axios: AxiosInstance;
  /** Auth token for private API calls. */
  private _token!: string;


  /**
   * Creates a new instance of {@link DatadisClient}.
   * 
   * @param username NIF for the user in Datadis
   * @param password Password for Datatis
   * @param timeout timeout to use in the API calls. Defaults to 60000 as Datadis takes it time to answer...
   */
  constructor(username: string, password: string, timeout: number = 60000) {
    // create account:
    this.account = new Account(username, password);
    // create axios:
    this._axios = axios.create({
      baseURL: BASE_URL,
      timeout,
      withCredentials: true
    });
  }


  /**
   * Gets an authentication token for the private API.
   * 
   * @throws a {@link DatadisAuthError} if auth fails.
   * 
   * @returns retuns an object with an {@link Account} and the response token.
   */
  async login(): Promise<{ account: Account, token: string }> {
    const data = qs.stringify({
      'username': this.account.username,
      'password': this.account.password 
    });
    
    const config = {
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    };
    
    try {
      const response = await this._axios.post(Endpoints.PrivateEndpoints.LOGIN, data, config);
      // setting token:
      this._token = response.data;
      this._axios.defaults.headers.common.Authorization = `Bearer ${this._token}`;
      return {
        account: this.account,
        token: this._token,
      }
    } catch(err: any) {
      throw new DatadisAuthError(err.message, err.response?.status, err.response?.data);
    }
  }


  /**
   * Get all supplies.
   * 
   * @param authorizedNif the NIF of another person that has been authorized.
   * @param distributorCode the distributor code you can get with {@link DatadisClient.getDistributorsWithSupplies} (1: Viesgo, 2: E-distribución, 3: E-redes, 4: ASEME, 5: UFD, 6: EOSA, 7:CIDE, 8: IDE).
   * 
   * @throws a {@link DatadisAPIError} if API call fails.
   * @throws a {@link DatadisError} if something else fails.
   * 
   * @returns an array of {@link Supply}.
   */
  async getSupplies(authorizedNif?: string, distributorCode?: string): Promise<Supply[]> {
    try {
      const {data} = await this._axios.get<Supply[]>(Endpoints.PrivateEndpoints.GET_SUPPLIES, { params: {authorizedNif, distributorCode} });
      return plainToInstance(Supply, data);
    } catch(err: any) {
      if (isAxiosError(err)) throw new DatadisAPIError(err.message, err.response?.status, err.response?.data);
      throw new DatadisError(err.message, err.response?.status, err.response?.data);
    }
  }


  /**
   * Gets contract details for a {@link Supply}.
   * 
   * @param supply a {@link Supply}.
   * @param supply.cups a valid CUPS from a {@link Supply}.
   * @param supply.distributorCode a valid distributor code from a {@link Supply}. Valid values: (1: Viesgo, 2: E-distribución, 3: E-redes, 4: ASEME, 5: UFD, 6: EOSA, 7:CIDE, 8: IDE).
   * @param authorizedNif the NIF of another person that has been authorized.
   * 
   * @throws a {@link DatadisAPIError} if API call fails.
   * @throws a {@link DatadisError} if something else fails.
   * 
   * @returns an array of {@link ContractDetail}.
   */
  async getContractDetail(supply: {cups: string, distributorCode: string}, authorizedNif?: string): Promise<ContractDetail[]> {
    const {cups, distributorCode} = supply;

    try {
      const {data} = await this._axios.get<ContractDetail[]>(Endpoints.PrivateEndpoints.GET_CONTRACT_DETAILS, { params: {cups, distributorCode, authorizedNif} });
      return plainToInstance(ContractDetail, data);
    } catch(err: any) {
      if (isAxiosError(err)) throw new DatadisAPIError(err.message, err.response?.status, err.response?.data);
      throw new DatadisError(err.message, err.response?.status, err.response?.data);
    }
  }


  /**
   * Gets consumption data for a {@link Supply} in a given time range.
   * Right now, Datadis only support queries for a natural month, dates provided would be truncated.
   * Datadis takes both start and end dates as inclusive, this is, if you want to get consumption data from August, you must pass 2024/08/XX and 2024/08/XX. If you pass 2024/08/XX and 2024/09/XX you would be asking for all data for August and Sept.
   * 
   * WARNING: This call can only be done once a day for the same time range.
   * 
   * @param supply a {@link Supply}.
   * @param supply.cups a valid CUPS from a {@link Supply}.
   * @param supply.distributorCode a valid distributor code from a {@link Supply}. Valid values: (1: Viesgo, 2: E-distribución, 3: E-redes, 4: ASEME, 5: UFD, 6: EOSA, 7:CIDE, 8: IDE).
   * @param supply.pointType a valid point type from a {@link Supply}.
   * @param startDate Start date from the desired time range.
   * @param endDate End date from the desired time range.
   * @param measurementType Set to `0` to get consumption data every hour. Set to `1` to get consumption data every 15 minutes (at the moment, this last case is only available for a combination of point type 1 or 2 and distributor code  2).
   * @param authorizedNif the NIF of another person that has been authorized.
   * 
   * @throws a {@link DatadisAPIError} if API call fails.
   * @throws a {@link DatadisError} if something else fails.
   * 
   * @returns an array of {@link ConsumptionData}.
   */
  async getConsumptionData(supply: {cups: string, distributorCode: string, pointType: number}, startDate: Date = new Date(), endDate: Date = new Date(), measurementType: 0|1 = 0, authorizedNif?: string): Promise<ConsumptionData[]> {
    const {cups, distributorCode, pointType} = supply;

    try {
      const {data} = await this._axios.get<ConsumptionData[]>(Endpoints.PrivateEndpoints.GET_CONSUMPTION_DATA, { params: {cups, distributorCode, startDate: formatDateToYearAndMonthOnly(startDate), endDate: formatDateToYearAndMonthOnly(endDate), measurementType, pointType, authorizedNif} });
      return plainToInstance(ConsumptionData, data);
    } catch(err: any) {
      if (isAxiosError(err)) throw new DatadisAPIError(err.message, err.response?.status, err.response?.data);
      throw new DatadisError(err.message, err.response?.status, err.response?.data);
    }
  }


  /**
   * Get max demanded power for a {@link Supply} in a given time range.
   * Datadis takes start and end dates the same way as in {@link getConsumptionData}, have a look at its documentation.
   * 
   * WARNING: This call can only be done once a day for the same time range.
   * 
   * @param supply a {@link Supply}.
   * @param supply.cups a valid CUPS from a {@link Supply}.
   * @param supply.distributorCode a valid distributor code from a {@link Supply}. Valid values: (1: Viesgo, 2: E-distribución, 3: E-redes, 4: ASEME, 5: UFD, 6: EOSA, 7:CIDE, 8: IDE).
   * @param startDate Start date from the desired time range.
   * @param endDate End date from the desired time range.
   * @param authorizedNif the NIF of another person that has been authorized.
   * 
   * @throws a {@link DatadisAPIError} if API call fails.
   * @throws a {@link DatadisError} if something else fails.
   * 
   * @returns and array of {@link MaxPowerData}, one for each period defined in the supply's contract.
   */
  async getMaxPower(supply: {cups: string, distributorCode: string}, startDate: Date = new Date(), endDate: Date = new Date(), authorizedNif?: string): Promise<MaxPowerData[]> {
    const {cups, distributorCode} = supply;

    try {
      const {data} = await this._axios.get<MaxPowerData[]>(Endpoints.PrivateEndpoints.GET_MAX_POWER, { params: {cups, distributorCode, startDate: formatDateToYearAndMonthOnly(startDate), endDate: formatDateToYearAndMonthOnly(endDate), authorizedNif} });
      return plainToInstance(MaxPowerData, data);
    } catch(err: any) {
      if (isAxiosError(err)) throw new DatadisAPIError(err.message, err.response?.status, err.response?.data);
      throw new DatadisError(err.message, err.response?.status, err.response?.data);
    }
  }


  /**
   * Gets a list for distributors where the user has supplies.
   * 
   * @param authorizedNif the NIF of another person that has been authorized.
   * 
   * @throws a {@link DatadisAPIError} if API call fails.
   * @throws a {@link DatadisError} if something else fails.
   * 
   * @returns a {@link DistributorsWithSupplies}
   */
  async getDistributorsWithSupplies(authorizedNif?: string): Promise<DistributorsWithSupplies> {
    try {
      const {data} = await this._axios.get<DistributorsWithSupplies>(Endpoints.PrivateEndpoints.GET_DISTRIBUTORS_WITH_SUPPLIES, { params: {authorizedNif} });
      return plainToInstance(DistributorsWithSupplies, data);
    } catch(err: any) {
      if (isAxiosError(err)) throw new DatadisAPIError(err.message, err.response?.status, err.response?.data);
      throw new DatadisError(err.message, err.response?.status, err.response?.data);
    }
  }

}
