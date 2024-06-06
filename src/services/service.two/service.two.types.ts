export interface IServiceTwoState {
  count: number;
  width: number;
  height: number;
}

export const SERVICE_TWO_STATUS = [
  'INIT',
  'READY',
  'DISPOSE',
  'STATUS_TWO',
];
export type ServiceTwoStatusKey = typeof SERVICE_TWO_STATUS[number];

export const SERVICE_TWO_ERROR = [
  'UNKNOWN',
  'ABORT',
  'SERVICE_TWO_ERROR',
];
export type ServiceTwoErrorKey = typeof SERVICE_TWO_ERROR[number];

export type IServiceTwoDi = {
  serviceOne: string,
}
