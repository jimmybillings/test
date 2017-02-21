import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Store, ActionReducer, Action } from '@ngrx/store';

const emptyGallery: any = {
  results: []
};

export const gallery: ActionReducer<any> = (state: any = emptyGallery, action: Action) => {
  switch (action.type) {
    case 'UPDATE_GALLERY':
      return Object.assign({}, { results: action.payload });

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

  public updateWith(results: any): void {
    this.store.dispatch({ type: 'UPDATE_GALLERY', payload: results });
  }

  public get state(): any {
    let state: any;
    this.data.take(1).subscribe(galleryData => state = galleryData);
    return state;
  }
}
