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

export interface CollectionStore {
  collections: Collection[];
  focusedCollection: Collection;
}
