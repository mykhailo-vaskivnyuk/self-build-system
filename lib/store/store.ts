import { EventEmitter } from '@lib/event.emitter/event.emitter';
import { ErrorClass, ErrorInstance } from '@lib/error/error';
import { ServiceErrorClass, ServiceErrorInstance } from '@lib/error/service.error';
import { isChanged, toConsole } from '@lib/utils';
import { IStoreState, StoreStatus } from './store.types';

export class Store<
  T extends object,
  K extends string = string,
  E extends string = string,
  S extends IStoreState<T, K, E> = IStoreState<T, K, E>,
> extends EventEmitter {
  protected $state: T;

  protected loading = false;

  protected status: StoreStatus<K>;

  protected error: ErrorInstance<E> | ServiceErrorInstance<E> | null = null;

  protected ac: AbortController | null = null;

  protected timer?: NodeJS.Timeout;

  constructor(
    protected initialState: T,
    public Error: ErrorClass<E> | ServiceErrorClass<E>,
    protected initialStatus: StoreStatus<K> = 'READY',
  ) {
    super();
    this.$state = { ...this.initialState };
    this.status = initialStatus;
  }

  async init() {
    this.debug('Init method is not implemented');
  }

  get state(): S {
    return { ...this.$state, ...this.statusProps } as S;
  }

  private get statusProps() {
    const { loading, status, error } = this;
    return { loading, status, error };
  }

  protected setState(newState: Partial<S>) {
    const { loading, status, error, ...otherProps } = newState;
    let statusChanged = false;
    if (typeof loading !== 'undefined') {
      this.loading = loading;
      statusChanged = true;
    }
    if (typeof status !== 'undefined') {
      this.status = status;
      statusChanged = true;
    }
    if (typeof error !== 'undefined') {
      this.error = error;
      statusChanged = true;
    }
    if (Object.keys(otherProps)) {
      this.$state = Object.assign(this.$state, otherProps);
      this.emit('state', this.$state);
    }
    if (statusChanged) {
      this.emit('status', this.statusProps);
    }
  }

  protected setError(e: unknown, key?: ErrorInstance<E>['key'], partialState?: Partial<S>) {
    const error = this.Error.from(e, key);
    this.error = error;
    this.abort();
    this.setState({ error, ...partialState } as S);
    return error;
  }

  subscribe(
    cb: (state: S) => void,
    keys: (keyof S)[] = [],
    as: AbortSignal | null = null,
    emitStateOnInit = false,
  ) {
    let curState = this.state;

    const handler = (state: T) => {
      const newState = { ...state, ...this.statusProps } as S;
      const changed = isChanged(keys, curState, newState);
      curState = newState;
      changed && cb(curState);
    };

    const off = this.on('state', handler);
    as?.addEventListener('abort', off);
    emitStateOnInit && cb(curState);

    return off;
  }

  // useState(keys: (keyof S)[] = [], ...args: any[]) {
  //   const [state, setState] = useState(() => this.state);

  //   this.debug(...args);

  //   useEffect(() => this.subscribe(setState, keys, null, false), [...keys]);

  //   return state;
  // }

  // useStatus(keys: (keyof IStatusProps<K, E>)[] = [], ...args: any[]) {
  //   const [state, setState] = useState(() => this.statusProps);

  //   this.debug(...args);

  //   useEffect(() => {
  //     let curStatusProps = this.statusProps;

  //     const handler = (newStatusProps: IStatusProps<K, E>) => {
  //       const changed = isChanged(keys, curStatusProps, newStatusProps);
  //       curStatusProps = newStatusProps;
  //       changed && setState(curStatusProps);
  //     };

  //     return this.on('status', handler);
  //   }, [...keys]);

  //   return state as IStatusProps<K, E>;
  // }

  async *getIterator(
    keys: (keyof S)[] = [],
    as?: AbortSignal,
    emitStateOnInit = false,
  ): AsyncGenerator<S> {
    const eventQueue: S[] = [];
    let resolve: ((state?: S) => void) | undefined;

    const onState = (newState: S) => {
      if (resolve) resolve(newState);
      else eventQueue.push(newState);
    };

    const off = this.subscribe(onState, keys, as, emitStateOnInit);
    const onAbort = () => {
      off();
      resolve?.();
    };
    this.ac?.signal.addEventListener('abort', onAbort);
    as?.addEventListener('abort', onAbort);
    const aborted = () => as?.aborted || this.ac?.signal.aborted;

    const setResolve = (rv: (state?: S) => void) => {
      resolve = (state?: S) => {
        resolve = undefined;
        rv(state);
      };
    };

    do {
      let newState = eventQueue.shift();
      if (newState) {
        yield newState;
      } else {
        newState = await new Promise(setResolve);
        if (!newState) return;
        if (aborted()) return;
        yield newState;
      }
    } while (!aborted());
  }

  // useLoading(startDelay?: number, stopDelay?: number) {
  //   const [value, setValue] = useState(false);

  //   useEffect(() => {
  //     let timer: NodeJS.Timeout | undefined;
  //     const start = () => {
  //       setValue(true);
  //       timer = undefined;
  //     };
  //     const stop = () => {
  //       setValue(false);
  //       timer = undefined;
  //     };
  //     let handleStart = start;
  //     let handleStop = stop;
  //     if (startDelay) {
  //       handleStart = () => {
  //         timer = setTimeout(start, startDelay, true) as any;
  //       };
  //     }
  //     if (stopDelay) {
  //       handleStop = () => {
  //         timer = setTimeout(stop, stopDelay, false) as any;
  //       };
  //     }
  //     let prevLoading = false;
  //     const handler = () => {
  //       if (this.loading === prevLoading) return;
  //       prevLoading = this.loading;
  //       clearTimeout(timer);
  //       if (timer) timer = undefined;
  //       else this.loading ? handleStart() : handleStop();
  //     };
  //     return this.on('status', handler);
  //   }, [startDelay, stopDelay]);

  //   return value;
  // }

  protected getFromStorage(): S {
    const key = this.constructor.name;
    try {
      const stateSerialized = localStorage.getItem(key);
      return JSON.parse(stateSerialized || '{}');
    } catch (e) {
      return {} as S;
    }
  }

  protected saveToStorage() {
    const key = this.constructor.name;
    try {
      const stateSerialized = JSON.stringify(this.state);
      localStorage.setItem(key, stateSerialized);
    } catch (e) {
      throw this.Error.from(e);
    }
  }

  debug(...args: any[]) {
    toConsole(this, ...args);
  }

  abort() {
    this.ac?.abort();
    this.ac = null;
    if (this.error) return;
    this.setError(null, 'ABORT');
  }

  clear(withStatus?: StoreStatus<K>) {
    clearTimeout(this.timer);
    const status = withStatus || this.initialStatus;
    const error = null;
    const loading = false;
    this.setState({ ...this.initialState, loading, error, status });
  }

  despose() {
    this.setState({ status: 'DESPOSE' } as Partial<S>);
    clearTimeout(this.timer);
    this.ac?.abort();
    this.offAll();
    this.saveToStorage();
  }
}
