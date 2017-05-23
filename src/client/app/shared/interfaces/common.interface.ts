export { ViewAddress } from './user.interface';
import { SpeedviewData } from './asset.interface';

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
  thumbnail?: { name: string, urls: AssetUrls };
  smallPreview?: { name: string, urls: AssetUrls };
  hasDownloadableComp?: boolean;
  transcodeTargets?: string[];
  primary?: Array<{ value: string }>;
  detailTypeMap?: any;
  uuid?: string;
  timeStart?: number;
  timeEnd?: number;
  speedviewData?: SpeedviewData;
}

export interface AssetUrls {
  http?: string;
  https?: string;
}

export interface Poj {
  [index: string]: any;
}

export interface Viewport {
  top: number;
  bottom: number;
  left: number;
  right: number;
  width: number;
  height: number;
}

export interface Coords {
  x?: number;
  y?: number;
}
