import { Store } from '@lib/store/store';
import { ServiceErrorClass } from '@lib/error/service.error';
import { IPaginationState } from './pagination.types';
import { PAGINATION_INITIAL_STATE } from './pagination.constants';

export class Pagination extends Store<IPaginationState> {
  constructor(public override Error: ServiceErrorClass<any>) {
    super(PAGINATION_INITIAL_STATE, Error);
    this.setTotal = this.setTotal.bind(this);
    this.setLimit = this.setLimit.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.prevPage = this.prevPage.bind(this);
    this.toFirstPage = this.toFirstPage.bind(this);
    this.toLastPage = this.toLastPage.bind(this);
    this.reset = this.reset.bind(this);
  }

  override setState(state: Partial<IPaginationState>) {
    this.$state = Object.assign(this.$state, state);
    const params = {} as IPaginationState;
    params.page = this.getPage();
    params.pageCount = this.getPageCount();
    params.range = this.getRange();
    params.isFirstPage = this.isFirstPage();
    params.isLastPage = this.isLastPage();
    Object.assign(this.$state, params);
    super.setState(this.$state);
  }

  setTotal(total: number) {
    this.setState({ total });
    const { limit } = this.$state;
    const toPrevPage = total === limit * (this.getPage() - 1);
    toPrevPage && this.prevPage();
  }

  setLimit(limit: number) {
    const { offset, total } = this.$state;
    let newOffset = offset - (offset % limit);
    if (offset > total) {
      newOffset = Math.ceil(total / limit) * limit - limit;
    }
    this.setState({ offset: newOffset, limit });
  }

  nextPage() {
    const { offset, limit, isLastPage } = this.$state;
    if (isLastPage) return;
    this.setState({ offset: offset + limit });
  }

  prevPage() {
    const { offset, limit, isFirstPage } = this.$state;
    if (isFirstPage) return;
    this.setState({ offset: offset - limit });
  }

  toFirstPage() {
    if (this.isFirstPage()) return;
    this.setState({ offset: 0 });
  }

  toLastPage() {
    const { limit, pageCount, isLastPage } = this.$state;
    if (isLastPage) return;
    const offset = (pageCount - 1) * limit;
    this.setState({ offset });
  }

  reset() {
    Object.assign(this.$state, {
      offset: 0,
      page: 1,
      range: { from: 0, to: this.$state.limit },
      isFirstPage: true,
    });
  }

  private getPage() {
    const { offset, limit } = this.$state;
    return offset / limit + 1;
  }

  private getPageCount() {
    const { limit, total } = this.$state;
    return Math.ceil(total / limit);
  }

  private getRange() {
    const { offset, limit, total } = this.$state;
    const from = offset;
    const to = this.isLastPage() ? total : offset + limit;
    return { from, to };
  }

  private isFirstPage() {
    return this.getPage() <= 1;
  }

  private isLastPage() {
    return this.getPage() >= this.getPageCount();
  }
}
