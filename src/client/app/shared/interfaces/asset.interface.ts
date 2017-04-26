import { Frame } from 'wazee-frame-formatter';
import { Asset, Pagination } from './common.interface';

export interface AssetDetailI {
  name: string;
  metadata?: Array<Object>;
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
