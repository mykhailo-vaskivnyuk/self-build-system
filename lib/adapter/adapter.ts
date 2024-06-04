/* eslint-disable no-loop-func */
import { EventEmitter } from '@lib/event.emitter/event.emitter';

export interface IAdapterConfig<T extends Record<string, any>, K extends keyof T> {
  connect: Record<K, string>
}

export class Adapter<T extends Record<string, any>> extends EventEmitter {
  protected di = {} as T;

  constructor(protected bus: EventEmitter, protected config: IAdapterConfig<T, keyof T>) {
    super();
    this.on('prepare', this.prepare.bind(this));
  }

  protected prepare() {
    const { connect } = this.config;
    const entries = Object.entries(connect);
    let counter = entries.length;
    for (const [propertyName, instanceName] of entries) {
      this.bus.once(instanceName, (instance: any) => {
        this[propertyName as keyof this] = instance;
        counter--;
        if (!counter) this.bus.emit('prepared', this);
      });
    }
    this.bus.once('init', this.init.bind(this));
    this.bus.once('start', this.start.bind(this));
  }

  init() {
    // subscribe to injected dependecies
  }

  start() {
    // start listen or execute
  }
}
