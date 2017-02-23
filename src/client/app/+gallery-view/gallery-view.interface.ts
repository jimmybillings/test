export interface Gallery {
  results: Object[];
  numberOfLevels: number;
  path: GalleryPath;
}

export type GalleryPath = GalleryPathSegment[];

export interface GalleryPathSegment {
  ids: number[];
  names: string[];
}
