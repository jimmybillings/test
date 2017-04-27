import { ViewAddress, Pagination, Common, PriceAttributes, Store } from './common.interface';

export type QuoteType = 'standard' | 'ProvisionalOrder' | 'OfflineAgreement';
export type QuoteStatus = 'ACTIVE' | 'PENDING' | 'ORDERED' | 'EXPIRED' | 'CANCELLED';
export type TranscodeStatus = 'Submitted' | 'Completed' | 'Failed' | 'UrlError' | 'Deleted';
export type OrderType = 'PurchaseOnCredit' | 'CreditCard' | 'BadDebt' | 'ChannelOrder'
  | 'PromotionalOrder' | 'FulfillmentOrder' | 'OfflineAgreement'
  | 'ProvisionalOrder' | 'PurchaseOrder' | 'RevenueOnly' | 'SubscriptionOrder';
export type OrderStatus = 'Order';
export type EditableQuoteFields = 'bulkOrderId' | 'discount';
// Base interfaces

export interface CommonCommerce extends Common {
  projects?: Project[];
}

export interface Project {
  id: string;
  name: string;
  clientName: string;
  subtotal: number;
  lineItems?: Array<AssetLineItem | FeeLineItem>;
  [index: string]: any;
}

export interface AssetLineItem {
  id?: string;
  asset?: Asset;
  notes?: Array<any>;
  multiplier?: number;
  transcodeStatus?: TranscodeStatus;
  downloadUrl?: string;
  asperaSpec?: string;
  tomSubmitTimestamp?: number;
  tomCompleteTimestamp?: number;
  tomTransactionId?: string;
  selectedTranscodeTarget?: string;
  transcodeTargets?: Array<string>;
  expirationDate?: number;
  attributes?: Array<PriceAttributes>;
  salesForceId?: string;
  price?: number;
  rightsManaged?: string;
}

export interface FeeLineItem {
  amount?: string;
  feeType?: string;
  notes?: string;
  salesForceId?: string;
}

export interface Asset {
  assetId?: number;
  assetName?: string;
  assetDuration?: number;
  metadata?: Metadatum[];
  rightsManaged?: string;
  supplierId?: number;
  supplierName?: string;
  thumbnailUrl?: string;
  timeStart?: number;
  timeEnd?: number;
}

export interface Metadatum {
  name: string;
  value: string;
}

// Store initial states

export interface CartState {
  data: Cart;
};

export interface QuoteState {
  data: Quote;
};

export interface CheckoutState {
  purchaseOptions: {
    purchaseOnCredit: boolean;
    creditExemption: boolean;
  };
  addresses: ViewAddress[];
  selectedAddress: ViewAddress;
  authorization: any;
  selectedPurchaseType: OrderType;
}

// Models

export interface Cart extends CommonCommerce {
  discount?: number;
  itemCount?: number;
  projects?: Project[];
  stripePublicKey?: string;
  subTotal?: number;
  total?: number;
  userId?: number;
}

export interface Order extends CommonCommerce {
  paymentTerms?: string;
  poNumber?: string;
  discount?: number;
  bulkOrderId?: string;
  createdUserId: number;
  ownerUserId: number;
  orderStatus: OrderStatus;
  orderType: OrderType;
  quoteId: number;
  taxAmount: number;
  licenseAgreementId: string;
  refundAmount: number;
  salesVertical: string;
  oldCommerceId: number;
  salesForceId: string;
  createdByIntegration: boolean;
  salesForceSyncedError: boolean;
  paymentBalance: number;
  projects: Project[];
}

export interface Quote extends CommonCommerce {
  createdUserId: number;
  ownerUserId: number;
  total: number;
  subTotal?: number;
  quoteStatus: QuoteStatus;
  purchaseType?: QuoteType;
  projects?: Project[];
  itemCount?: number;
  expirationDate?: string;
  focused?: boolean;
  stripePublicKey?: string;
  bulkOrderId?: string;
  discount?: string;
}

export interface OrdersApiResponse extends Pagination {
  items: Order[];
}

export interface Orders extends Store {
  items: Order[];
}

export interface QuotesApiResponse extends Pagination {
  items: Quote[];
}

export interface Quotes extends Store {
  items: Quote[];
}

export interface AddAssetParameters {
  lineItem: AssetLineItem;
  attributes?: {
    [index: string]: any;
  };
}

export interface QuoteOptions {
  purchaseType?: QuoteType;
  emailAddress?: string;
  expirationDate?: string;
  users?: any[];
}

export interface CommerceMessage {
  type: string;
  payload?: any;
}

