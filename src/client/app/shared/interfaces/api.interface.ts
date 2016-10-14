export enum Api {
  Identities,
  Orders
};

export interface ApiParameters {
  [key: string]: string;
}

export interface ApiBody {
  [key: string]: any;
};

export interface ApiOptions {
  parameters?: ApiParameters;
  body?: ApiBody;
  loading?: boolean;
  overridingToken?: string;
}
