import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Store, ActionReducer, Action } from '@ngrx/store';

import { Gallery, GalleryBreadcrumb } from '../gallery-view.interface';

const emptyGallery: Gallery = {
  results: [],
  numberOfLevels: 0,
  breadcrumbs: []
};

export const gallery: ActionReducer<any> = (state: any = emptyGallery, action: Action) => {
  switch (action.type) {
    case 'UPDATE_GALLERY':
      return Object.assign({}, action.payload);

    default:
      return state;
  }
};

@Injectable()
export class GalleryViewStore {
  constructor(private store: Store<any>) { }

  public get data(): Observable<any> {
    return this.store.select('gallery');
  }

  public initializeWith(results: any): void {
    this.store.dispatch({
      type: 'UPDATE_GALLERY',
      payload: { results: results, numberOfLevels: this.numberOfLevelsIn(results), breadcrumbs: [{ ids: [1], names: ['Home'] }] }
    });
  }

  public updateWith(results: any, breadcrumb: GalleryBreadcrumb): void {
    const breadcrumbs: GalleryBreadcrumb[] = (JSON.parse(JSON.stringify(this.state.breadcrumbs)) || []);
    breadcrumbs.push(breadcrumb);

    this.store.dispatch({
      type: 'UPDATE_GALLERY',
      payload: { results: results, numberOfLevels: this.numberOfLevelsIn(results), breadcrumbs: breadcrumbs }
    });
  }

  public replaceWith(results: any, breadcrumbs: GalleryBreadcrumb[]): void {
    this.store.dispatch({
      type: 'UPDATE_GALLERY',
      payload: { results: results, numberOfLevels: this.numberOfLevelsIn(results), breadcrumbs: breadcrumbs }
    });
  }

  public get state(): any {
    let state: any;
    this.data.take(1).subscribe(galleryData => state = galleryData);
    return state;
  }

  private numberOfLevelsIn(results: any[]): number {
    return results ? 1 + Math.max(...results.map(result => this.numberOfLevelsIn(result.children))) : 0;
  }
}
