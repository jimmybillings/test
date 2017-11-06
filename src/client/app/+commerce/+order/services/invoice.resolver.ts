import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AppStore } from '../../../app.store';

@Injectable()
export class InvoiceResolver implements Resolve<boolean> {
  constructor(private store: AppStore) { }

  public resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    const orderId: number = Number(route.params['id']);

    this.store.dispatch(factory => factory.invoice.load(orderId));

    return this.store.blockUntil(state => !state.invoice.loading);
  }
}
