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
    .filter(([action, state]: [CartActions.LoadSuccess, AppState]) => state.cartAsset.loadParameters !== null)
    .map(([action, state]: [CartActions.LoadSuccess, AppState]) => {
      const extraLoadParams: Common.CartAssetApiLoadParameters
        = this.mergeCartAssetWithLoadParameters(state.cart.data, state.cartAsset.loadParameters);
      return this.store.create(factory => factory.cartAsset.loadAfterCartAvailable(extraLoadParams));
    });

  @Effect()
  public load: Observable<Action> = this.actions.ofType(CartAssetActions.Load.Type)
    .withLatestFrom(this.store.select(state => state.cart.data))
    .map(([action, cart]: [CartAssetActions.Load, Commerce.Cart]) => {
      let mapper: InternalActionFactoryMapper;
      if (cart.id === null) {
        mapper = (factory) => factory.cart.load();
      } else {
        const extraLoadParams: Common.CartAssetApiLoadParameters
          = this.mergeCartAssetWithLoadParameters(cart, action.loadParameters);
        mapper = (factory) => factory.cartAsset.loadAfterCartAvailable(extraLoadParams);
      }
      return this.store.create(mapper);
    });

  constructor(
    private actions: Actions,
    private store: AppStore,
    private service: AssetService
  ) { }

  private mergeCartAssetWithLoadParameters(
    cart: Commerce.Cart,
    loadParameters: Common.CartAssetUrlLoadParameters
  ): Common.CartAssetApiLoadParameters {
    const lineItems: Commerce.AssetLineItem[] = cart.projects
      .reduce((assetsArr, project) => assetsArr.concat(project.lineItems), []);

    const asset: Commerce.Asset = lineItems
      .find(lineItem => lineItem.id === loadParameters.uuid).asset;

    return this.extraLoadParametersFrom(asset);
  }

  private extraLoadParametersFrom(asset: Commerce.Asset): Common.CartAssetApiLoadParameters {
    return {
      id: String(asset.assetId),
      uuid: String(asset.uuid),
      timeStart: String(asset.timeStart),
      timeEnd: String(asset.timeEnd)
    };
  }
}
