import { ErrorClass } from '../error/error';

export type IStoreState<T extends object, K extends string, E extends string> = T &
  IStatusProps<K, E>;

export interface IStatusProps<K extends string, E extends string> {
  loading: boolean;
  error: InstanceType<ErrorClass<E>> | null;
  status: StoreStatus<K>;
}

export type StoreStatus<K extends string> = K | StoreStatusKey;

export type StoreStatusKey = 'INIT' | 'READY' | 'DESPOSE';
