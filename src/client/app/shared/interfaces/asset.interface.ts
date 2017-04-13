import { Frame } from 'wazee-frame-formatter';
import { Asset, ApiResults } from './common.interface';

export interface AssetDetailI {
  name: string;
  metadata?: Array<Object>;
}

export interface SearchResult extends ApiResults {
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
