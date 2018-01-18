import { Asset, Pagination, Pojo, Coords } from './common.interface';
import { EnhancedAsset } from './enhanced-asset';
import { SubclipMarkers } from './subclip-markers';
import { FormFields } from './forms.interface';

export interface SearchResult extends Pagination {
  items?: Array<Asset>;
}

export interface SpeedviewEvent {
  asset: Asset;
  position: Coords;
}

export interface SpeedviewData {
  noData?: boolean;
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

export interface AssetShareDialogOptions {
  enhancedAsset: EnhancedAsset;
  subclipMarkers: SubclipMarkers;
  formFields: FormFields[];
}
