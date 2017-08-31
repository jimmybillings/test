import { Asset, Pagination, Pojo, Coords } from './common.interface';

// export interface SearchAssetState {
//   asset: Asset;
//   priceForDialog: number;
//   priceForDetails: number;
// }

export interface SearchResult extends Pagination {
  items?: Array<Asset>;
}

export interface SpeedviewEvent {
  asset: Asset;
  position: Coords;
}

export interface SpeedviewData {
  imageQuickView?: boolean;
  price?: number;
  pricingType?: 'Royalty Free' | 'Rights Managed' | '';
  url?: string;
  posterUrl?: string;
  values?: Array<Pojo>;
}
