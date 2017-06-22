export enum Feature {
  disableCollectionAccess,
  disableCartAccess,
  disableCommerceAgreements
};

export interface Features {
  [index: string]: boolean;
}
