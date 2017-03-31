import { Project } from './cart.interface';

export interface Quote {
  createdUserId?: number;
  ownerUserId: number;
  userId: number;
  projects?: Project[];
  total: number;
  itemCount?: number;
  quoteStatus: 'ACTIVE' | 'PENDING' | 'ORDERED' | 'EXPIRED';
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
