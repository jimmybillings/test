import {FormFields} from './forms.interface.ts';

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
}

export interface UiConfigInterface {
  id: number;
  siteName: string;
  createdOn: string;
  lastUpdated: string;
  components: UiComponents;
  config: Object;
}

export interface UiSubComponents {
  [ index: string ]: { items: Array<FormFields> | Array<TableHeaders> };
}

export interface UiComponents {
  config: { [ index: string ]: { items: Array<FormFields> | Array<TableHeaders> } };
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

export interface AdminParams {
  s?: string;
  d?: string;
  i?: string;
  n?: string;
  fields?: string;
  values?: string;
}
