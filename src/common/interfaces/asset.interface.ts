export interface Asset {
  name: string;
  metadata?: Array<Object>;
}


export interface SearchResult {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  items?: Array<Object>;
}
