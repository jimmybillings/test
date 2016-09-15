export interface Collection {
  createdOn: string;
  lastUpdated: string;
  id: number;
  siteName: string;
  name: string;
  owner: number;
  email?: string;
  userRole?: string;
  editors?: number[];
  assets?: Items;
  tags?: any;
  assetCount?: number;
  editorsCount?: number;
  tagCount?: number;
  collectionThumbnail?: { name: string, urls: { https: string }};
  assetsCount?: number;
}

export interface Collections {
  items?: Collection[];
  pagination: Pagination;
}

export interface CollectionStore {
  collections: Collections;
  focusedCollection: Collection;
}

export interface Items {
  items?: Assets[];
  pagination?: Pagination;
}

export interface Assets {
  assetId: number;
  createdOn?: string;
  lastUpdated?: string;
  metaData?: { name: string, value: string }[];
  name?: string;
  thumbnail?: { name: string, urls: {} };
  uuid: string;
}

export interface Pagination {
  totalCount: number;
  currentPage?: number;
  pageSize?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  numberOfPages?: number;
}
