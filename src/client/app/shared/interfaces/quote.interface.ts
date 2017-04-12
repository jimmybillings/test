import { Project } from './cart.interface';
import { ViewAddress } from './user.interface';

export type PurchaseType = 'standard' | 'ProvisionalOrder' | 'OfflineAgreement';
export type QuoteStatus = 'ACTIVE' | 'PENDING' | 'ORDERED' | 'EXPIRED' | 'CANCELLED';

export interface Quote {
  id: number;
  createdUserId: number;
  ownerUserId: number;
  total: number;
  quoteStatus: QuoteStatus;
  purchaseType?: 'string';
  projects?: Project[];
  itemCount?: number;
  focused?: boolean;
  // bogus stuff for cart/quote compatibility
  stripePublicKey?: string;
}

export interface QuoteOptions {
  purchaseType: PurchaseType;
  emailAddress?: string;
  expirationDate?: string;
  users?: any[];
}

export interface QuoteList {
  items: Quote[];
  pagination: {
    totalCount: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    numberOfPages: number;
  };
}

export interface QuoteState {
  data: Quote;
  orderInProgress: {
    purchaseOptions: {
      purchaseOnCredit: boolean;
      creditExemption: boolean;
    }
    addresses: ViewAddress[];
    selectedAddress: ViewAddress;
    authorization: any;
    selectedPurchaseType: string;
  };
};
