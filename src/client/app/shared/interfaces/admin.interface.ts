import { FormFields } from './forms.interface';
import { User } from './user.interface';

export interface Account {
  createdOn: string;
  lastUpdated: string;
  id: number;
  siteName: string;
  accountIdentifier: string;
  name: string;
  searchConfiguration?: {
    filter: string;
    searchableFields: string[];
    searchResultFields: string[];
    fieldMaps: {};
    typeAheadFields: string[];
    searchFilterTreeId: number;
  };
  description?: string;
  status?: string;
  contact?: string;
  address?: {
    address: string;
    state: string;
    city: string;
    country: string;
    zipcode: string;
    phone: string;
    suburb: string;
  };
  email?: string;
  alternateName?: string;
  logoURL?: string;
  admin?: boolean;
  default?: boolean;
  [index: string]: any;
}

export interface UiConfigInterface {
  id: number;
  siteName: string;
  createdOn: string;
  lastUpdated: string;
  components: UiComponentsA | UiComponentsB;
  config: Object;
}

export interface UiSubComponentsA {
  [ index: string ]: { items: Array<FormFields> | Array<TableHeaders> };
}

export interface UiSubComponentsB {
  [ index: string ]: { value: string };
}

export interface UiComponentsA {
  config: UiSubComponentsA;
}

export interface UiComponentsB {
  config: UiSubComponentsB;
}

export interface UiComponents {
  [ index: string ]: { config: UiSubComponentsA | UiSubComponentsB };
}

export interface TableHeaders {
  name: string;
  label: string;
}

export interface SiteConfig {
  id: number;
  siteName: string;
  lastUpdated: string;
  createdOn: string;
  searchConfiguration: {
    filter: string;
    searchableFields: string[];
    searchResultFields: string[];
    fieldMaps: Object;
    typeAheadFields: string[];
    searchFilterTreeId: number;
  };
  displayName: string;
  siteUrl: string;
  accountIds: number[];
  registrationRedirectUrl: string;
  applicationBaseUrl: string;
  smtpServerInfo: {
    host: string;
    port: string;
    user: string;
    password: string;
  };
  defaultAccountFilter: string;
  searchApiKey: string;
  viewableIndexedFields: {
    fieldRegex: string;
    fields: string[];
  };
  assetDetailConfigIds: number[];
  core: boolean;
}

export interface AdminUrlParams {
  s?: string;
  d?: string;
  i?: string;
  n?: string;
  fields?: string;
  values?: string;
}

export interface AdminFormParams {
  [index: string]: string;
}

export interface AdminState {
  items?: User[] | Account[];
  pagination?: Pagination;
}

export interface Pagination {
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  numberOfPages?: number;
}

export interface AdminResponse {
  items?: User[] | Account[];
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  numberOfPages?: number;
}

export interface AdminUiResponse {
  items?: UiConfigInterface[];
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  numberOfPages?: number;
}

export interface AdminSiteResponse {
  items?: SiteConfig[];
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  numberOfPages?: number;
}
