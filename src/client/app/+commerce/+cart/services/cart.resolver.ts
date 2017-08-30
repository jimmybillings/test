import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AppStore } from '../../../app.store';

@Injectable()
export class CartResolver implements Resolve<boolean> {
  constructor(private store: AppStore) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this.store.dispatch(factory => factory.cart.load());

    return this.store.blockUntil(state => !state.cart.loading);
  }
}
