/* eslint-disable no-loop-func */
import { EventEmitter } from '../event.emitter/event.emitter';

export interface IAdapterConfig<T extends Record<string, string>, K extends keyof T = keyof T> {
  name: string;
  deps: Record<K, string>;
}

export class Adapter<T extends Record<string, string>> extends EventEmitter {
  constructor(protected bus: EventEmitter | null, protected config: IAdapterConfig<T>) {
    super();
    if (!this.bus) return;
    const depsArr = Object.entries(config.deps);
    let counter = depsArr.length;
    for (const [propertyName, instanceName] of depsArr) {
      this.bus.once(instanceName, (instance: any) => {
        this[propertyName as keyof this] = instance;
        counter--;
        if (!counter) this.emit('prepared', this);
      });
    }
    this.bus.once('prepare', this.prepare.bind(this));
    this.bus.once('init', this.init.bind(this));
    this.bus.once('start', this.start.bind(this));
  }

  protected prepare() {
    this.bus?.emit(this.config.name, this);
  }

  init() {
    // subscribe on dependecies
    this.emit('inited', this);
  }

  start() {
    // start listen or execute
    this.emit('started', this);
  }
}
