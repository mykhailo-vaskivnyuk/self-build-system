/* eslint-disable no-console */
export const isChanged = <T extends object>(keys: (keyof T)[], first: T | undefined, second: T) => {
  if (!keys.length || !first) return true;
  return keys.some((p) => !Object.is(first[p], second[p]));
};

export const STYLE = {
  whiteBlack: 'color: white; background: black',
  grayOrange: 'color: greay; background: orange',
};
export const toConsole = (instance: object, ...args: any[]) => {
  if (process.env.NODE_ENV !== 'development') return;
  if (!args.length) return;
  const instanceOf = instance.constructor.name;
  const [toLog] = args;
  let log = '';
  if (typeof toLog === 'string') log = args.shift();
  if (typeof toLog === 'function') log = args.shift().name;
  console.log('%c %s %c %s', STYLE.whiteBlack, instanceOf, STYLE.grayOrange, log, ...args);
};
