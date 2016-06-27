export interface Collection {
  createdOn: string;
  lastUpdated: string;
  id: number;
  siteName: string;
  name: string;
  owner: string;
  editors?: number[];
  assets?: Items;
  tags?: any;
  assetCount?: number;
  editorsCount?: number;
  tagCount?: number;
}

export interface Collections {
  items?: Collection[];
  pagination: Pagination;
}

export interface CollectionStore {
  collections: Collections;
  // collectionList: Collection[];
  focusedCollection: Collection;
}

export interface Items {
  items?: Assets[];
  pagination?: Pagination;
}

export interface Assets {
  assetId: number;
  metaData: { name: string, value: string }[];
  name: string;
  thumbnail: { name: string, urls: {} };
  uuid: string;
}

export interface Pagination {
  totalCount: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  numberOfPages: number;
}
