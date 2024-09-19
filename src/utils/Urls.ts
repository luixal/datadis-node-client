export const BASE_URL = 'https://datadis.es';

/** Endpoint for Datadis Private API (auth needed) */
enum PrivateEndpoints {
  LOGIN = '/nikola-auth/tokens/login',
  GET_SUPPLIES = '/api-private/api/get-supplies',
  GET_CONTRACT_DETAILS = '/api-private/api/get-contract-detail',
  GET_CONSUMPTION_DATA = '/api-private/api/get-consumption-data',
  GET_MAX_POWER = '/api-private/api/get-max-power',
  GET_DISTRIBUTORS_WITH_SUPPLIES = '/api-private/api/get-distributors-with-supplies'
}

/** Datatdis Endpoints */
export const Endpoints = {
  PrivateEndpoints
}

