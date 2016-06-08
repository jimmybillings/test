export interface Collection {
  createdOn: string;
  lastUpdated: string;
  id: number;
  siteName: string;
  name: string;
  owner: string;
  editors?: number[];
  assets?: string[];
  tags?: any;
  assetCount?: number;
  editorsCount?: number;
  tagCount?: number;
}

export interface Collections {
  items?: Collection[];
  pagination: {
    totalCount: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    numberOfPages: number;
  };
}

export interface CollectionStore {
  collections: Collections;
  // collectionList: Collection[];
  focusedCollection: Collection;
}
