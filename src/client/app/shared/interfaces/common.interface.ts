export { ViewAddress } from './user.interface';

export interface Pagination {
  totalCount: number;
  currentPage?: number;
  pageSize?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  numberOfPages?: number;
}

export interface Common {
  id?: number;
  siteName?: string;
  createdOn?: Date;
  lastUpdated?: Date;
}

export interface WzEvent {
  type: string;
  payload?: any;
}

export interface Store {
  pagination: Pagination;
}

export interface SelectedPriceAttributes {
  priceAttributeName: string;
  selectedAttributeValue: string;
}

export interface UrlParams {
  s?: string;
  d?: string;
  i?: number;
  n?: number;
}

export interface Asset extends Common {
  assetId: number;
  name: string;
  metaData?: { name: string, value: string }[];
  thumbnail?: { name: string, urls: {} };
  smallPreview?: { name: string, urls: {} };
  hasDownloadableComp?: boolean;
  transcodeTargets?: string[];
  primary?: Array<{ value: string }>;
  detailTypeMap?: any;
  uuid?: string;
}

export interface Poj {
  [index: string]: any;
}
