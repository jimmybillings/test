import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AppStore } from '../../../app.store';

@Injectable()
export class QuoteAssetResolver implements Resolve<boolean> {
  constructor(private store: AppStore) { }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this.store.dispatch(factory => factory.quoteAsset.load({ uuid: route.params.uuid }));

    return this.store.blockUntil(state => !state.quoteAsset.loading);
  }
}
