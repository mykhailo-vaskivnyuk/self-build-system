import { IPaginationState } from './pagination.types';

export const PAGINATION_INITIAL_STATE: IPaginationState = {
  offset: 0,
  limit: 0,
  total: 0,
  page: 1,
  pageCount: 0,
  range: { from: 0, to: 0 },
  isFirstPage: true,
  isLastPage: true,
};
