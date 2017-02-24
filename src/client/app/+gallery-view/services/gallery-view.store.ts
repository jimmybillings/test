import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Store, ActionReducer, Action } from '@ngrx/store';

import { Gallery, GalleryResults, GalleryPath } from '../gallery-view.interface';

const emptyGallery: Gallery = {
  results: [],
  numberOfLevels: 0,
  path: []
};

export const gallery: ActionReducer<Gallery> = (state: Gallery = emptyGallery, action: Action) => {
  switch (action.type) {
    case 'UPDATE_GALLERY':
      return Object.assign({}, action.payload);

    default:
      return state;
  }
};

@Injectable()
export class GalleryViewStore {
  constructor(private store: Store<Gallery>) { }

  public get data(): Observable<Gallery> {
    return this.store.select('gallery');
  }

  public replaceWith(results: GalleryResults, path: GalleryPath): void {
    this.store.dispatch({
      type: 'UPDATE_GALLERY',
      payload: { results: results, numberOfLevels: this.numberOfLevelsIn(results), path: path }
    });
  }

  public get state(): Gallery {
    let state: Gallery;
    this.data.take(1).subscribe(galleryData => state = galleryData);
    return state;
  }

  private numberOfLevelsIn(results: GalleryResults): number {
    return results ? 1 + Math.max(...results.map(result => this.numberOfLevelsIn(result.children))) : 0;
  }
}
