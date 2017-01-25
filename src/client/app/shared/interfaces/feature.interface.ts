export enum Feature {
  collection,
  cart
};

export interface Features {
  [index: string]: boolean;
}
