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
  asperaSpec?: string;
  mobile?: boolean;
  url?: string;
  useType?: string;
}

export interface DeliveryOption {
  deliveryOptionId: number;
  deliveryOptionLabel?: string;
  deliveryOptionTransferType?: string;
  deliveryOptionUseType?: string;
  deliveryOptionGroupId?: string;
  deliveryOptionGroupOrder?: string;
  renditionUrl?: RenditionUrl;
}

export type DeliveryOptionGroup = Array<DeliveryOption>;

export type DeliveryOptions = Array<DeliveryOptionGroup>;

export interface ApiDeliveryOptions {
  list?: Array<DeliveryOption>;
}
