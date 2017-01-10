export interface AssetDetailI {
  name: string;
  metadata?: Array<Object>;
}

export interface SearchResult {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  items?: Array<Asset>;
}

export interface Asset {
  assetId: number;
  name: string;
  metaData?: { name: string, value: string }[];
  thumbnail?: { name: string, urls: {} };
  smallPreview?: { name: string, urls: {} };
}

export interface TranscodeTarget {
  name: string;
  selected: boolean;
}
