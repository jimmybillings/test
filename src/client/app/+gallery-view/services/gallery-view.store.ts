import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Store, ActionReducer, Action } from '@ngrx/store';

import { Gallery, GalleryPath } from '../gallery-view.interface';

const emptyGallery: Gallery = {
  results: [],
  numberOfLevels: 0,
  path: []
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

  public replaceWith(results: any, path: GalleryPath): void {
    this.store.dispatch({
      type: 'UPDATE_GALLERY',
      payload: { results: results, numberOfLevels: this.numberOfLevelsIn(results), path: path }
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
