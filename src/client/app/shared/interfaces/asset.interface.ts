import { Frame } from 'wazee-frame-formatter';
import { Asset, Pagination, Pojo, Coords } from './common.interface';

export interface AssetState {
  asset: Asset;
  priceForDialog: number;
  priceForDetails: number;
}

export interface SearchResult extends Pagination {
  items?: Array<Asset>;
}

export interface SubclipMarkers {
  in?: Frame;
  out?: Frame;
}

export interface SpeedviewEvent {
  asset: Asset;
  position: Coords;
}

export interface SpeedviewData {
  imageQuickView?: boolean;
  price?: number;
  pricingType?: 'Royalty Free' | 'Rights Managed';
  url?: string;
  values?: Array<Pojo>;
}
