export interface AccountI {
  id: number;
  createdOn: string;
  lastUpdated: string;
  accountIdentifier: string;
  isAdmin: boolean;
  isDefault: boolean;
  name: string;
  searchConfiguration: {
    filter: string
  };
  siteName: string;
  status: string;
};
