import { Action } from '@ngrx/store';

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

  // These were all used in asset-detail.html before its
  // "asset" input was typed.  Unsure if this is the right
  // "Asset" to put these in...  Further analysis is warranted.
  price?: number;
  common?: Array<{ value: string }>;
  clipThumbnailUrl?: string;
}

export interface AssetLoadParameters {
  readonly id: string;
  readonly share_key?: string;
  readonly uuid?: string;
  readonly timeStart?: string;
  readonly timeEnd?: string;
}

export interface AssetUrls {
  http?: string;
  https?: string;
}

export interface Pojo {
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

export interface Position {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
}

export interface Geolocation {
  lat: number;
  lng: number;
}

export interface Circle {
  center: number;
  radius: number;
  getBounds: Function;
}

export interface Autocomplete {
  setBounds: Function;
  addListener: Function;
  getPlace: Function;
}

// Temporary interface -- needed only until we convert all stores to the new AppStore way.
export interface LegacyAction extends Action {
  payload?: any;
}

export type ObjectType = 'collection' | 'cart';

export type CommentAccess = 'Commenter' | 'Viewer' | 'Editor';

export interface Comment extends Common {
  userId: number;
  objectType: ObjectType;
  objectId: string;
  hidden: boolean;
  comment: string;
  access: CommentAccess;
  timeStart?: string;
  timeEnd?: string;
  [index: string]: any;
}

export interface CommentsApiResponse extends Pagination {
  items: Array<Comment>;
}

export interface Comments {
  items: Array<Comment>;
  pagination: Pagination;
}
