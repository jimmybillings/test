import { Common, Pagination, Asset } from './common.interface';

export interface Collection extends Common {
  name: string;
  owner: number;
  email?: string;
  userRole?: string;
  editors?: number[];
  assets?: CollectionItems;
  tags?: any;
  assetCount?: number;
  editorsCount?: number;
  tagCount?: number;
  collectionThumbnail?: { name: string, urls: { https: string } };
  assetsCount?: number;
}

export interface CollectionsStoreI {
  items: Collection[];
  pagination: Pagination;
}

export interface CollectionItems {
  items?: Asset[];
  pagination?: Pagination;
}

export interface CollectionItemsResponse {
  items: Asset[],
  totalCount: number,
  currentPage: number,
  pageSize: number,
  hasNextPage: boolean,
  hasPreviousPage: boolean,
  numberOfPages: number
}

export interface CollectionItemMarkersUpdater {
  uuid: string,
  assetId: number,
  timeStart: string,
  timeEnd: string
}
