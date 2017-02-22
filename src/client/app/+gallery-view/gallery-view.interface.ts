export interface Gallery {
  results: Object[];
  numberOfLevels: number;
  breadcrumbs: GalleryBreadcrumb[];
}

export interface GalleryBreadcrumb {
  ids: number[];
  names: string[];
}
