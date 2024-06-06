import { Store } from '../../../lib/store/store';
import { ServiceTwoErrorKey, IServiceTwoState, ServiceTwoStatusKey, IServiceTwoDi } from './service.two.types';
import { INITIAL_STATE } from './service.two.constants';
import { ServiceOne } from '../service.one/service.one';
import { IAdapterConfig } from '../../../lib/adapter/adapter';

export class ServiceTwo extends Store<
  IServiceTwoState,
  ServiceTwoStatusKey,
  ServiceTwoErrorKey
> {
  serviceOne!: ServiceOne;

  constructor(protected app: Store<any>, config: IAdapterConfig<IServiceTwoDi>) {
    super(app, config, INITIAL_STATE, app.Error, 'READY');
  }

  addCount() {
    this.setState({ count: ++this.$state.count });
  }
}
