/* eslint-disable no-loop-func */
import { EventEmitter } from '../event.emitter/event.emitter';

export interface IAdapterConfig<T extends Record<string, string>, K extends keyof T = keyof T> {
  connect: Record<K, string>;
}

export class Adapter<T extends Record<string, string>> extends EventEmitter {
  protected config: IAdapterConfig<T>;

  constructor(protected bus: EventEmitter | null, protected name: string, di: T) {
    super();
    this.config = { connect: di };
    this.on('prepare', this.prepare.bind(this));
  }

  protected prepare() {
    if (!this.bus) return;
    const { connect } = this.config;
    const entries = Object.entries(connect);
    let counter = entries.length;
    for (const [propertyName, instanceName] of entries) {
      this.bus.once(instanceName, (instance: any) => {
        this[propertyName as keyof this] = instance;
        counter--;
        if (!counter) this.bus?.emit('prepared', this);
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
