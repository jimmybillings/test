import { Frame } from 'wazee-frame-formatter';
import { Asset, Pagination } from './common.interface';

export interface AssetState {
  asset: Asset;
  priceForDialog: number;
  priceForDetails: number;
}

export interface SearchResult extends Pagination {
  items?: Array<Asset>;
}

export interface SubclipMarkers {
  in?: number;
  out?: number;
}

export interface SubclipMarkerFrames {
  in?: Frame;
  out?: Frame;
}
