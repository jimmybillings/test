import { Project } from './cart.interface';

export interface Quote {
  id: number;
  createdUserId: number;
  ownerUserId: number;
  userId: number;
  total: number;
  quoteStatus: 'ACTIVE' | 'PENDING' | 'ORDERED' | 'EXPIRED';
  projects?: Project[];
  itemCount?: number;
  focused?: boolean;
}

export interface QuoteOptions {
  status: 'ACTIVE' | 'PENDING' | 'ORDERED' | 'EXPIRED';
  purchaseType: PurchaseType;
  emailAddress?: string;
  expirationDate?: string;
  users?: any[];
}

export type PurchaseType = 'standard' | 'ProvisionalOrder' | 'OfflineAgreement';

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
