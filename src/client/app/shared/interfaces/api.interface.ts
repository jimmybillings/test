export enum Api {
  Identities,
  Assets,
  Orders
};

export interface ApiParameters {
  [key: string]: string;
}

export interface ApiBody {
  [key: string]: any;
};

export interface ApiResponse {
  [key: string]: any;
};

export interface ApiOptions {
  parameters?: ApiParameters;
  body?: ApiBody;
  loading?: boolean;
  overridingToken?: string;
}
