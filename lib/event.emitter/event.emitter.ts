export class EventEmitter {
  private events: Record<string, ((data: any) => void)[]> = {};

  on(event: string, cb: (data: any) => void) {
    const events = this.events[event];
    events ? events.push(cb) : (this.events[event] = [cb]);
    return () => this.off(event, cb);
  }

  off(event: string, cb: (data: any) => void) {
    const handlers = this.events[event];
    if (!handlers) return;
    this.events[event] = handlers.filter((handler) => handler !== cb);
  }

  emit(event: string, data: any) {
    const handlers = this.events[event] || [];
    handlers.forEach((handler) => handler(data));
  }

  once(event: string, cb: (data: any) => void) {
    const onceCb: typeof cb = (data) => {
      this.off(event, onceCb);
      cb(data);
    };
    return this.on(event, onceCb);
  }

  offAll() {
    this.events = {};
  }
}
