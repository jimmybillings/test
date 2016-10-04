export interface Cart {
  userId: number;
  projects?: Project[];
  total: number;
}

export interface Project {
  id: string;
  name: string;
  clientName: string;
  subtotal: number;
  lineitems?: LineItem[];
  [index: string]: any;
}

export interface LineItem {
  id: string;
  asset?: Asset;
  price: number;
}

export interface Asset {
  assetId: number;
  assetName: string;
  startTime: number;
  endTime: number;
  thumbnailUrl: string;
  metadata?: Metadatum[];
}

export interface Metadatum {
  name: string;
  value: string;
}
