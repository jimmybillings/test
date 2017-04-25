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
