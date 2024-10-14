import { IAxiosRetryConfig } from "axios-retry";

export const USERNAME = 'myUsernameForDatadis';
export const PASSWORD = 'myPasswordForDatadis';
export const TIMEOUT = 30000;
export const DATE = new Date('2024-10-02');
export const RETRY_CONFIG:IAxiosRetryConfig = {
  retries: 3,
  retryDelay: (retryCount) => {
    return 1000;
  },
  retryCondition: (error) => {
    return error.response?.status != 429;
  }
};