import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import * as CartActions from '../actions/cart.actions';
import { AppStore } from '../../app.store';
import { FutureCartService } from '../services/cart.service';
import { Cart, AssetLineItem } from '../../shared/interfaces/commerce.interface';

@Injectable()
export class CartEffects {
  @Effect()
  public load: Observable<Action> = this.actions.ofType(CartActions.Load.Type)
    .switchMap(action => this.service.load())
    .map(cart => this.store.create(factory => factory.cart.loadSuccess(cart)))
    .catch(error => Observable.of(this.store.create(factory => factory.cart.loadFailure(error))));

  @Effect()
  public editLineItemMarkers: Observable<Action> = this.actions.ofType(CartActions.EditLineItemFromDetails.Type)
    .withLatestFrom(this.store.select(state => state.cart.data))
    .switchMap(([action, cart]: [CartActions.EditLineItemFromDetails, Cart]) => {
      const lineItemToEdit: AssetLineItem = this.findLineItemBy(action.uuid, cart);
      return this.service.editLineItem(lineItemToEdit, action.markers, action.selectedAttributes)
        .map(cart => this.store.create(factory => factory.cart.editLineItemFromDetailsSuccess(cart)))
        .catch(error => Observable.of(this.store.create(factory => factory.cart.editLineItemFromDetailsFailure(error))));
    });

  constructor(private actions: Actions, private store: AppStore, private service: FutureCartService) { }

  private findLineItemBy(assetLineItemUuid: string, cart: Cart): AssetLineItem {
    return cart.projects
      .reduce((allLineItems, project) => allLineItems.concat(project.lineItems), [])
      .find(lineItem => lineItem.id === assetLineItemUuid);
  }
}
