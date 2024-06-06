import { Store } from '../../../lib/store/store';
import { ServiceOneErrorKey, IServiceOneState, ServiceOneStatusKey, IServiceOneDi } from './service.one.types';
import { INITIAL_STATE } from './service.one.constants';
import { ServiceTwo } from '../service.two/service.two';

export class ServiceOne extends Store<
  IServiceOneState,
  ServiceOneStatusKey,
  ServiceOneErrorKey,
  IServiceOneDi
> {
  serviceTwo!: ServiceTwo;

  constructor(protected app: Store<any>, name: string, di: IServiceOneDi) {
    super(app, name, di, INITIAL_STATE, app.Error, 'READY');
  }

  addCount() {
    this.serviceTwo.addCount();
    this.setState({ count: this.$state.count++ });
  }
}
