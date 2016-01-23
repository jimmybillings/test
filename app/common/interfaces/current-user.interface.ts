
export interface CurrentUserInterface {
  emailAddress: string;
  firstName: string;
  lastName: string;
  accounts: [{
    accountIdentifier: string;
    createdOn: string;
    description: string;
    id: number;
    isAdmin: boolean;
    lastUpdated: string;
    name: string;
  }];
}

