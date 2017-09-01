import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import * as CartActions from '../actions/cart.actions';
import { AppStore, AppState, InternalActionFactoryMapper } from '../../app.store';
import { Cart } from '../../shared/interfaces/commerce.interface';
import { AssetLineItem, Asset } from '../../shared/interfaces/commerce.interface';
import { FutureCartService } from '../services/cart.service';

@Injectable()
export class CartEffects {
  @Effect()
  public load: Observable<Action> = this.actions.ofType(CartActions.Load.Type)
    .switchMap(action => this.service.load())
    .map(cart => this.store.create(factory => factory.cart.loadSuccess(cart)))
    .catch(error => Observable.of(this.store.create(factory => factory.cart.loadFailure(error))));

  constructor(private actions: Actions, private store: AppStore, private service: FutureCartService) { }
}
