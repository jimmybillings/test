import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Router } from '@angular/router';

import * as OrderActions from '../actions/order.actions';
import { AppStore } from '../../app.store';
import { FutureOrderService } from '../services/order.service';
import { Order } from '../../shared/interfaces/commerce.interface';

@Injectable()
export class OrderEffects {
  @Effect()
  public load: Observable<Action> = this.actions.ofType(OrderActions.Load.Type)
    .switchMap((action: OrderActions.Load) =>
      this.service.load(action.orderId)
        .map((order: Order) => this.store.create(factory => factory.order.loadSuccess(order)))
        .catch(error => Observable.of(this.store.create(factory => factory.order.loadFailure(error))))
    );

  constructor(private actions: Actions, private store: AppStore, private service: FutureOrderService) { }
}
