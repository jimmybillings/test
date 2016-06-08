
export interface CurrentUserInterface {
  emailAddress: string;
  firstName: string;
  lastName: string;
  createdOn: string;
  lastUpdated: string;
  siteName: string;
  id: number;
  accountIds: number[];
  password: string;
  permissions?: Object[];
  ownedCollections?: number[];
  editableCollections?: number[];
  accessibleCollections?: number[];
  focusedCollection?: number;
}

