import { createErrorClass } from '../../lib/error/error';
import { EventEmitter } from '../../lib/event.emitter/event.emitter';
import { Store } from '../../lib/store/store';
import { TModule } from './app.types';

export class App extends Store<any> {
  constructor(modules: TModule[]) {
    super(new EventEmitter(), 'app', {}, {}, createErrorClass());
    for (const Module of modules) Module(this);
  }
}
