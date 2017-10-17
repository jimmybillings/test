import { Asset, Pagination, Pojo, Coords } from './common.interface';

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

export interface RenditionUrl {
  assetId: number;
  mobile?: boolean;
  url?: string;
  useType?: string;
}

export interface DeliveryOption {
  deliveryOptionId: number;
  deliveryOptionLabel?: string;
  deliveryOptionTransferType?: string;
  deliveryOptionUseType?: string;
  renditionUrl?: RenditionUrl;
}

export interface DeliveryOptions {
  list?: Array<DeliveryOption>;
}
