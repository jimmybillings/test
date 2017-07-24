import { ViewAddress, Pagination, Common, SelectedPriceAttributes, Store } from './common.interface';
import { SubclipMarkers } from './asset.interface';

export type QuoteType = 'standard' | 'ProvisionalOrder' | 'OfflineAgreement';
export type QuoteStatus = 'ACTIVE' | 'PENDING' | 'ORDERED' | 'EXPIRED' | 'CANCELLED';
export type TranscodeStatus = 'Submitted' | 'Completed' | 'Failed' | 'UrlError' | 'Deleted';
export type OrderType = 'PurchaseOnCredit' | 'CreditCard' | 'BadDebt' | 'ChannelOrder' | 'FulfillmentOrder' | 'OfflineAgreement'
  | 'ProvisionalOrder' | 'PurchaseOrder' | 'RevenueOnly' | 'SubscriptionOrder' | 'Hold';
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
  creditMemoForProjectId?: number;
  lineItems?: Array<AssetLineItem>;
  feeLineItems?: Array<FeeLineItem>;
  attributes?: Array<SelectedPriceAttributes>;
  [index: string]: any;
}

export interface AssetLineItem {
  id?: string;
  asset?: Asset;
  notes?: Array<any>;
  itemPrice?: number;
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
  attributes?: Array<SelectedPriceAttributes>;
  salesForceId?: string;
  price?: number;
  rightsManaged?: string;
}

export interface FeeLineItem {
  id?: string;
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
  clipUrl?: string;
  uuid?: string;
}

export interface Metadatum {
  name: string;
  value: string;
}

export interface FeeConfigItem {
  id: number;
  siteName: string;
  name: string;
  amount: number;
  financeCode: string;
  paymentRestriction: string;
  accountId: number;
}

export interface FeeConfig {
  items: FeeConfigItem[];
}

// Store initial states

export interface CartState {
  data: Cart;
};

export interface QuoteState {
  data: Quote;
};

export interface CheckoutState {
  paymentOptions: PaymentOptions;
  addresses: ViewAddress[];
  selectedAddress: ViewAddress;
  authorization: any;
  selectedPaymentType: OrderType;
}

export interface FeeConfigState {
  initialized: boolean;
  feeConfig: FeeConfig;
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
  creditMemoForOrderId?: number;
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
  markers?: SubclipMarkers;
  attributes?: {
    [index: string]: any;
  };
}

export interface QuoteOptions {
  ownerEmail?: string;
  expirationDate?: string;
  purchaseType?: QuoteType;
}

export interface CommerceMessage {
  type: string;
  payload?: any;
}

export interface PriceOption {
  amount: number;
  multiplier: boolean;
  name: string;
  value: string;
}

export interface ValidChildChoicesMap {
  [key: string]: Array<string>;
}

export interface PriceAttribute {
  attributeList: Array<PriceOption>;
  childId: number;
  createdOn: string;
  displayName: string;
  id: number;
  lastUpdated: string;
  name: string;
  priceModel: string;
  siteName: string;
  validChildChoicesMap: ValidChildChoicesMap;
  primary?: boolean;
}

export interface PricingState {
  priceForDetails: number;
  priceForDialog: number;
}

export interface AddressPurchaseOptions {
  orderAddressId: number;
  orderAddressType: string;
}

export interface CreditCardPurchaseOptions {
  stripeToken: string;
  stripeTokenType: string;
}

export interface PurchaseOptions {
  orderAddressId: number;
  orderAddressType: string;
  stripeToken: string;
  stripeTokenType: string;
}

export interface PaymentOptions {
  paymentOptions: Array<OrderType>;
  explanation: string;
  noCheckout: boolean;
}

export interface Document {
  name: string;
  text: string;
}

export interface LicenseAgreement {
  projectType?: string;
  rights?: string;
  matchingAssets: Array<Asset>;
  document: Document;
}

export interface LicenseAgreements {
  items: Array<LicenseAgreement>;
}
