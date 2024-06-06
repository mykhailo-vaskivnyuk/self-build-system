import { Store } from '../lib/store/store';
import { App } from './app/app';
import { ServiceOne } from './services/service.one/service.one';
import { ServiceTwo } from './services/service.two/service.two';

const configOne = {
  name: 'service.one',
  deps: {
    serviceTwo: 'service.two',
  },
};

const configTwo = {
  name: 'service.two',
  deps: {
    serviceOne: 'service.one',
  },
};

const modules = [
  (bus: Store<any>) => new ServiceOne(bus, configOne),
  (bus: Store<any>) => new ServiceTwo(bus, configTwo),
];

const app = new App(modules);

setInterval(() => app.emit('count', {}), 1000);
