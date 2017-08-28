import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { AppStore } from '../../app.store';

@Injectable()
export class CollectionAssetResolver implements Resolve<boolean> {
  constructor(private store: AppStore) { }

  public resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    this.store.dispatch(factory => factory.asset.loadCollectionAsset({ uuid: route.params.uuid }));

    return this.store.blockUntil(state => !state.asset.loading);
  }
}
