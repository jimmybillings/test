import { ViewAddress, Pagination, Common, SelectedPriceAttribute, Store } from './common.interface';
import { SubclipMarkers } from './subclip-markers';
import { EnhancedAsset } from './enhanced-asset';
import { Address, Document, Payee } from './user.interface';

export type OrderableType =
  'SystemLicense' |
  'SystemLicenseNoDelivery' |
  'OfflineLicense' |
  'OfflineLicenseNoDelivery' |
  'PrepaySystemLicense' |
  'PrepayOfflineLicense' |
  'Trial' |
  'DeliveryOnly' |
  'BadDebt' |
  'ChannelNoDelivery';

export type PaymentOption =
  'SystemLicense' |
  'SystemLicenseNoDelivery' |
  'OfflineLicense' |
  'OfflineLicenseNoDelivery' |
  'PrepaySystemLicense' |
  'PrepayOfflineLicense' |
  'Trial' |
  'DeliveryOnly' |
  'BadDebt' |
  'ChannelNoDelivery' |
  'PurchaseOnCredit' |
  'CreditCard' |
  'Hold';

export type PaymentType =
  'PurchaseOnCredit' |
  'CreditCard';

export type QuoteStatus = 'ACTIVE' | 'PENDING' | 'ORDERED' | 'EXPIRED' | 'CANCELLED';

export type TranscodeStatus = 'Submitted' | 'Completed' | 'Failed' | 'UrlError' | 'Deleted';

export type OrderStatus = 'ORDER' | 'REFUND';

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
  attributes?: Array<SelectedPriceAttribute>;
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
  attributes?: Array<SelectedPriceAttribute>;
  salesForceId?: string;
  price?: number;
  grossAssetPrice?: number;
  rightsManaged?: string;
  externalAgreementIds?: string[];
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
  selectedPaymentType: PaymentOption;
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
  orderType: OrderableType;
  paymentType: PaymentType;
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
  paymentDueDate?: Date;
  creditMemoForOrderId?: number;
  projects: Project[];
}

export interface Quote extends CommonCommerce {
  createdUserId: number;
  createdUserEmailAddress?: string;
  createdUserFullName?: string;
  ownerUserId: number;
  total: number;
  subTotal?: number;
  quoteStatus: QuoteStatus;
  purchaseType?: OrderableType;
  projects?: Project[];
  itemCount?: number;
  expirationDate?: string;
  focused?: boolean;
  stripePublicKey?: string;
  bulkOrderId?: string;
  discount?: string;
  externalAgreementIds?: string[];
  internalAgreementIds?: number[];
  externalLicenseIds?: string[];
  internalLicenseIds?: number[];
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
  ownerEmail: string;
  expirationDate: string;
  purchaseType: string;
  offlineAgreementId?: string;
  [index: string]: any;
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
  // both the keys and the array of strings are PriceAttribute values!
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
  paymentOptions: Array<PaymentOption>;
  explanation: string;
  noCheckout: boolean;
}

export interface LicenseAgreementDocument {
  name: string;
  text: string;
}

export interface LicenseAgreement {
  projectType?: string;
  rights?: string;
  matchingAssets: Array<LicenseAsset | EnhancedAsset>;
  document: LicenseAgreementDocument;
}

export interface LicenseAgreements {
  items: Array<LicenseAgreement>;
}

export interface LicenseAsset {
  assetId: number;
  assetLineItemId: string;
  name: string;
  thumbnailUrl: string;
}

export interface Invoice {
  documents: Array<Document>;
  order: Order;
  payee: Payee;
}
