export interface Cart {
  userId: number;
  projects?: Project[];
  total: number;
}

export interface Project {
  id: string;
  name: string;
  clientName: string;
  subtotal: number;
  lineItems?: LineItem[];
  [index: string]: any;
}

export interface LineItem {
  id: string;
  asset?: Asset;
  price: number;
}

export interface Asset {
  assetId: number;
  assetName: string;
  startTime: number;
  endTime: number;
  thumbnailUrl: string;
  metadata?: Metadatum[];
}

export interface Metadatum {
  name: string;
  value: string;
}

export interface Order {
  createdOn: string;
  lastUpdated: string;
  id: number;
  siteName: string;
  orderStatus: string;
  orderType: string;
  createdUserId: number;
  ownerUserId: number;
  total: number;
  projects: [Project];
  lastModifiedBy?: any;
}

export interface Orders {
  items?: Order[];
  pagination: Pagination;
}

export interface Pagination {
  totalCount: number;
  currentPage?: number;
  pageSize?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  numberOfPages?: number;
}

export interface OrdersUrlParams {
  s?: string;
  d?: string;
  i?: string;
  n?: string;
  loading?: string;
}
