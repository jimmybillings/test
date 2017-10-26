import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Router } from '@angular/router';

import * as OrderActions from './order.actions';
import { AppStore } from '../../app.store';
import { OrderService } from './order.service';
import { Order, Invoice } from '../../shared/interfaces/commerce.interface';

@Injectable()
export class OrderEffects {
  @Effect()
  public load: Observable<Action> = this.actions.ofType(OrderActions.Load.Type)
    .switchMap((action: OrderActions.Load) =>
      this.service.load(action.orderId)
        .map((order: Order) => this.store.create(factory => factory.order.loadSuccess(order)))
        .catch(error => Observable.of(this.store.create(factory => factory.order.loadFailure(error))))
    );

  @Effect()
  public loadSuccess: Observable<Action> = this.actions.ofType(OrderActions.LoadSuccess.Type)
    .filter((action: OrderActions.LoadSuccess) => this.store.match(true, state => state.order.checkingOut))
    .mergeMap((action: Action) => Observable.from([
      this.store.create(factory => factory.order.setCheckoutState(false)),
      this.store.create(factory => factory.cart.load())
    ]));

  @Effect()
  public loadInvoice: Observable<Action> = this.actions.ofType(OrderActions.LoadInvoice.Type)
    .switchMap((action: OrderActions.LoadInvoice) =>
      this.service.getInvoiceData(action.orderId)
        .map((invoice: Invoice) => this.store.create(factory => factory.order.loadInvoiceSuccess(invoice)))
        .catch(error => Observable.of(this.store.create(factory => factory.order.loadInvoiceFailure(error))))
    );

  constructor(private actions: Actions, private store: AppStore, private service: OrderService) { }
}
