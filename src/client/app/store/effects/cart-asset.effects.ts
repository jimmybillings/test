import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';

import * as CartAssetActions from '../actions/cart-asset.actions';
import * as CartActions from '../actions/cart.actions';
import * as Common from '../../shared/interfaces/common.interface';
import * as Commerce from '../../shared/interfaces/commerce.interface';
import { AppStore, AppState, InternalActionFactoryMapper } from '../../app.store';
import { AssetService } from '../services/asset.service';

@Injectable()
export class CartAssetEffects {
  @Effect()
  public loadAfterCartAvailable: Observable<Action> = this.actions.ofType(CartAssetActions.LoadAfterCartAvailable.Type)
    .switchMap((action: CartAssetActions.LoadAfterCartAvailable) =>
      this.service.load(action.loadParameters)
        .map((asset: Common.Asset) => this.store.create(factory => factory.cartAsset.loadSuccess(asset)))
        .catch(error => Observable.of(this.store.create(factory => factory.cartAsset.loadFailure(error))))
    );

  @Effect() loadAssetOnCartLoadSuccess: Observable<Action> = this.actions.ofType(CartActions.LoadSuccess.Type)
    .withLatestFrom(this.store.select(state => state))
    .filter(([action, state]: [CartActions.LoadSuccess, AppState]) => !!state.cartAsset.loadingUuid)
    .map(([action, state]: [CartActions.LoadSuccess, AppState]) =>
      this.createNextActionFor(state.cart.data, state.cartAsset.loadingUuid)
    );

  @Effect()
  public load: Observable<Action> = this.actions.ofType(CartAssetActions.Load.Type)
    .withLatestFrom(this.store.select(state => state.cart.data))
    .map(([action, cart]: [CartAssetActions.Load, Commerce.Cart]) =>
      this.createNextActionFor(cart, action.assetUuid)
    );

  constructor(private actions: Actions, private store: AppStore, private service: AssetService) { }

  private createNextActionFor(cart: Commerce.Cart, assetUuid: string): Action {
    return this.store.create(this.nextActionMapperFor(cart, assetUuid));
  }

  private nextActionMapperFor(cart: Commerce.Cart, assetUuid: string): InternalActionFactoryMapper {
    if (cart.id === null) return factory => factory.cart.load();

    const lineItem: Commerce.AssetLineItem = cart.projects
      .reduce((allLineItems, project) => allLineItems.concat(project.lineItems), [])
      .find(lineItem => lineItem.id === assetUuid);

    if (lineItem) {
      const asset: Commerce.Asset = lineItem.asset;

      return factory => factory.cartAsset.loadAfterCartAvailable({
        id: String(asset.assetId), uuid: assetUuid, timeStart: String(asset.timeStart), timeEnd: String(asset.timeEnd)
      });
    }

    return factory => factory.cartAsset.loadFailure({ status: 404 });
  }
}
