import { Store } from '../../../lib/store/store';
import { ServiceTwoErrorKey, IServiceTwoState, ServiceTwoStatusKey, IServiceTwoDi } from './service.two.types';
import { INITIAL_STATE } from './service.two.constants';
import { ServiceOne } from '../service.one/service.one';

export class ServiceTwo extends Store<
  IServiceTwoState,
  ServiceTwoStatusKey,
  ServiceTwoErrorKey,
  IServiceTwoDi
> {
  serviceOne!: ServiceOne;

  constructor(protected app: Store<any>, name: string, di: IServiceTwoDi) {
    super(app, name, di, INITIAL_STATE, app.Error, 'READY');
  }

  addCount() {
    this.setState({ count: this.$state.count++ });
  }
}
