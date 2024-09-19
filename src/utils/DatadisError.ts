export class DatadisError extends Error {
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

export class DatadisAuthError extends Error {
  name: string;
  statusCode: number;
  data: Object;

  constructor(message: string, statusCode: number = 0, data: Object = {}) {
    super(message);
    this.name = 'DatadisAuthError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

export class DatadisAPIError extends Error {
  name: string;
  statusCode: number;
  data: Object;

  constructor(message: string, statusCode: number = 0, data: Object = {}) {
    super(message);
    this.name = 'DatadisAPIError';
    this.statusCode = statusCode;
    this.data = data;
  }
}