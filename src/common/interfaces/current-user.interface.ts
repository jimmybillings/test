
export interface CurrentUserInterface {
  emailAddress: string;
  firstName: string;
  lastName: string;
  createdOn: Date;
  lastUpdated: Date;
  siteName: string;
  id: number;
  accountIds: [{
    id: string;
  }];
}

