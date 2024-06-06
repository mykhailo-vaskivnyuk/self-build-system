import { Store } from '../../lib/store/store';

export type TModule = (bus: Store<any>) => Store<any>;
