import { Store } from '../../../lib/store/store';
import { ServiceOneErrorKey, IServiceOneState, ServiceOneStatusKey, IServiceOneDi } from './service.one.types';
import { INITIAL_STATE } from './service.one.constants';
import { ServiceTwo } from '../service.two/service.two';
import { IAdapterConfig } from '../../../lib/adapter/adapter';

export class ServiceOne extends Store<
  IServiceOneState,
  ServiceOneStatusKey,
  ServiceOneErrorKey
> {
  serviceTwo!: ServiceTwo;

  constructor(protected override bus: Store<any>, config: IAdapterConfig<IServiceOneDi>) {
    super(bus, config, INITIAL_STATE, bus.Error, 'READY');
  }

  override async init() {
    this.serviceTwo.subscribe((v) => this.debug('from service two', v.count));
    this.bus.on('count', () => this.addCount());
    super.init();
  }

  addCount() {
    this.serviceTwo.addCount();
    this.setState({ count: ++this.$state.count });
  }
}
