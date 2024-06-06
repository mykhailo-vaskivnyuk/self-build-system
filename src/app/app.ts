/* eslint-disable no-loop-func */
import { createErrorClass } from '../../lib/error/error';
import { Store } from '../../lib/store/store';
import { TModule } from './app.types';

export class App extends Store<any> {
  constructor(modules: TModule[]) {
    super(null, { name: 'app', deps: {} }, {}, createErrorClass());
    let notPrepared = modules.length;
    let notInited = modules.length;

    for (const Module of modules) {
      const module = Module(this);

      module.once('prepared', () => {
        notPrepared--;
        if (!notPrepared) this.emit('init', {});
      });

      module.once('inited', () => {
        notInited--;
        if (!notInited) this.emit('start', {});
      });
    }

    this.emit('prepare', {});
  }
}
