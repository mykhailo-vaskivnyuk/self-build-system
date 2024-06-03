/* eslint-disable no-console */
import { ErrorKey } from './error.types';

export const createErrorClass = <T extends string>() => class ErrorClass extends Error {
  key: ErrorKey<T>;

  static from(e: unknown, key: ErrorKey<T> = 'UNKNOWN') {
    console.log(key, e);
    if (e instanceof ErrorClass) return e;
    return new ErrorClass(key, { cause: e });
  }

  constructor(key: ErrorKey<T>, ...props: any[]) {
    super(key, ...props);
    this.key = key;
  }
};

export type ErrorClass<T extends string> = ReturnType<typeof createErrorClass<T>>;
export type ErrorInstance<T extends string> = InstanceType<ErrorClass<T>>;
