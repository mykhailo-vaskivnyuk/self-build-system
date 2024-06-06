import { Store } from '../lib/store/store';
import { App } from './app/app';
import { ServiceOne } from './services/service.one/service.one';
import { ServiceTwo } from './services/service.two/service.two';

const configOne = {
  serviceTwo: 'service.two',
};

const configTwo = {
  serviceOne: 'service.one',
};

const modules = [
  (bus: Store<any>) => new ServiceOne(bus, 'service.one', configOne),
  (bus: Store<any>) => new ServiceTwo(bus, 'service.one', configTwo),
];

const app = new App(modules);
app.emit('count', {});
