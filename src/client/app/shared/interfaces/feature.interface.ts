export enum Feature {
  disableCollectionAccess,
  disableCartAccess
};

export interface Features {
  [index: string]: boolean;
}
