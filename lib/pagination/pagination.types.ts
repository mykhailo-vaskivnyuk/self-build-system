export interface IPaginationState {
  offset: number;
  limit: number;
  total: number;
  page: number;
  pageCount: number;
  range: { from: number; to: number };
  isFirstPage: boolean;
  isLastPage: boolean;
}
