import axios, { AxiosInstance } from "axios";
import { plainToInstance } from "class-transformer";
import * as qs from 'qs';
import "reflect-metadata";

import Account from "./Account";
import { ConsumptionDataItem } from "./ConsumptionData";
import ContractDetail from "./ContractDetail";
import DistributorsWithSupplies from "./DistributorsWithSupplies";
import MaxPowerData from "./MaxPowerData";
import Supply from "./Supply";

class DatadisError extends Error {
  name: string;
  statusCode: number;
  data: Object;

  constructor(message: string, statusCode: number = 0, data: Object = {}) {
    super(message);
    this.name = 'DatadisError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

export default class DatadisClient {
  private account: Account;
  private _axios: AxiosInstance;
  private _token!: string;

  constructor(username: string, password: string, timeout: number = 10000) {
    // create account:
    this.account = new Account(username, password);
    // create axios:
    this._axios = axios.create({
      baseURL: 'https://datadis.es',
      timeout,
      withCredentials: true
    });
  }

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
      const response = await this._axios.post('/nikola-auth/tokens/login', data, config);
      // setting token:
      this._token = response.data;
      this._axios.defaults.headers.common.Authorization = `Bearer ${this._token}`;
      return {
        account: this.account,
        token: this._token,
      }
    } catch(err: any) {
      throw new DatadisError(err.message, err.response?.status, err.response?.data);
    }
  }

  async getSupplies(): Promise<Supply[]> {
    try {
      const {data} = await this._axios.get<Supply[]>('/api-private/api/get-supplies');
      return plainToInstance(Supply, data);
    } catch(err: any) {
      throw new DatadisError(err.message, err.response?.status, err.response?.data);
    }
  }

  async getContractDetail(supply: {cups: string, distributorCode: string}): Promise<ContractDetail[]> {
    const {cups, distributorCode} = supply;
    if (!cups || !distributorCode) throw new DatadisError('getContratDetail :: cups and distributorCode or a Supply object are mandatory');
    try {
      const {data} = await this._axios.get<ContractDetail[]>('/api-private/api/get-contract-detail', { params: {cups, distributorCode} });
      return plainToInstance(ContractDetail, data);
    } catch(err: any) {
      throw new DatadisError(err.message, err.response?.status, err.response?.data);
    }
  }

  async getConsumptionData(supply: {cups: string, distributorCode: string, pointType: number}, startDate: Date = new Date(), endDate: Date = new Date(), measurementType: 0|1 = 0): Promise<ConsumptionDataItem[]> {
    // aux function to format dates:
    const formatDate = (date: Date) => date.toISOString().split('-').slice(0,2).join('/');

    const {cups, distributorCode, pointType} = supply;
    if (!cups || !distributorCode || !pointType) throw new DatadisError('getConsumptionData :: cups, distributorCode and pointType or a Sypply object are mandatory');

    try {
      const {data} = await this._axios.get<ConsumptionDataItem[]>('/api-private/api/get-consumption-data', { params: {cups, distributorCode, startDate: formatDate(startDate), endDate: formatDate(endDate), measurementType, pointType} });
      return plainToInstance(ConsumptionDataItem, data);
    } catch(err: any) {
      throw new DatadisError(err.message, err.response?.status, err.response?.data);
    }
  }

  async getMaxPower(supply: {cups: string, distributorCode: string}, startDate: Date = new Date(), endDate: Date = new Date()): Promise<MaxPowerData[]> {
    // aux function to format dates:
    const formatDate = (date: Date) => date.toISOString().split('-').slice(0,2).join('/');

    const {cups, distributorCode} = supply;
    if (!cups || !distributorCode) throw new DatadisError('getMaxPower :: cups and distributorCode or a Sypply object are mandatory');

    try {
      const {data} = await this._axios.get<MaxPowerData[]>('/api-private/api/get-max-power', { params: {cups, distributorCode, startDate: formatDate(startDate), endDate: formatDate(endDate)} });
      return plainToInstance(MaxPowerData, data);
    } catch(err: any) {
      throw new DatadisError(err.message, err.response?.status, err.response?.data);
    }
  }

  async getDistributorsWithSupplies(authorizedNif?: string): Promise<DistributorsWithSupplies> {
    try {
      const {data} = await this._axios.get<DistributorsWithSupplies>('/api-private/api/get-distributors-with-supplies', { params: {authorizedNif} });
      return plainToInstance(DistributorsWithSupplies, data);
    } catch(err: any) {
      throw new DatadisError(err.message, err.response?.status, err.response?.data);
    }
  }

  // async fn() {
  //   this.getConsumptionData(new Supply(), new Date(), new Date(), 2);
  // }



}