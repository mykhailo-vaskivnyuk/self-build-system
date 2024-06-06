export interface IServiceOneState {
  count: number;
  width: number;
  height: number;
}

export const SERVICE_ONE_STATUS = [
  'INIT',
  'READY',
  'DISPOSE',
  'STATUS_ONE',
];
export type ServiceOneStatusKey = typeof SERVICE_ONE_STATUS[number];

export const SERVICE_ONE_ERROR = [
  'UNKNOWN',
  'ABORT',
  'SERVICE_ONE_ERROR',
];
export type ServiceOneErrorKey = typeof SERVICE_ONE_ERROR[number];

export type IServiceOneDi = {
  serviceTwo: string,
}
