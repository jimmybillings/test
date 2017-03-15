export interface User {
  id: number;
  siteName: string;
  password: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  lastUpdated: string;
  createdOn: string;
  searchConfiguration?: {
    filter: string;
    searchableFields: string[];
    searchResultFields: string[];
    fieldMaps: {};
    typeAheadFields: string[];
    searchFilterTreeId: number
  };
  userName?: string;
  roles?: [
    {
      id: number;
      siteName: string;
      name: string;
      description: string;
      permissions: string[];
      roleAccount: boolean
    }
  ];
  permissions?: string[];
  purchaseOnCredit?: boolean;
  phoneNumber?: string;
  zipcode?: string;
  accountIds?: number[];
  ownedCollections?: string[];
  editableCollections?: number[];
  accessibleCollections?: number[];
  focusedCollection?: number;
  root?: boolean;
  mailingAddress?: Address;
  [index: string]: any;
}

export interface Address {
  address: string;
  state: string;
  city: string;
  country: string;
  zipcode: string;
  phone: string;
  [index: string]: any;
}

export interface ViewAddress {
  addressEntityId: number;
  defaultAddress: boolean;
  type: string;
  name: string;
  address?: Address;
  [index: string]: any;
}
