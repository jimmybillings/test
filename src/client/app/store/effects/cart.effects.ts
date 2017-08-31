import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import * as CartActions from '../actions/cart.actions';
import { AppStore, AppState, InternalActionFactoryMapper } from '../../app.store';
import { Cart } from '../../shared/interfaces/commerce.interface';
import { AssetLoadParameters } from '../../shared/interfaces/common.interface';
import { AssetLineItem, Asset } from '../../shared/interfaces/commerce.interface';
import { FutureCartService } from '../services/cart.service';

@Injectable()
export class CartEffects {
  @Effect()
  public load: Observable<Action> = this.actions.ofType(CartActions.Load.Type)
    .switchMap(action => this.service.load())
    .map(cart => this.store.create(factory => factory.cart.loadSuccess(cart)))
    .catch(error => Observable.of(this.store.create(factory => factory.cart.loadFailure(error))));

  @Effect() ensureCartIsLoaded: Observable<Action> = this.actions.ofType(CartActions.LoadSuccess.Type)
    .withLatestFrom(this.store.select(state => state))
    .filter(([action, state]: [CartActions.LoadSuccess, AppState]) => state.asset.loadParameters !== null)
    .map(([action, state]: [CartActions.LoadSuccess, AppState]) => {
      const extraLoadParams: AssetLoadParameters = this.mergeCartAssetWithLoadParameters(state, state.asset.loadParameters);
      return this.store.create(factory => factory.asset.load(extraLoadParams));
    });

  @Effect()
  public loadAsset: Observable<Action> = this.actions.ofType(CartActions.LoadAsset.Type)
    .withLatestFrom(this.store.select(state => state))
    .map(([action, state]: [CartActions.LoadAsset, AppState]) => {
      let mapper: InternalActionFactoryMapper;
      if (state.cart.data.id === null) {
        mapper = (factory) => factory.cart.load();
      } else {
        const extraLoadParams: AssetLoadParameters = this.mergeCartAssetWithLoadParameters(state, action.loadParameters);
        mapper = (factory) => factory.asset.load(extraLoadParams);
      }
      return this.store.create(mapper);
    });

  constructor(private actions: Actions, private store: AppStore, private service: FutureCartService) { }

  private mergeCartAssetWithLoadParameters(state: AppState, loadParameters: AssetLoadParameters): AssetLoadParameters {
    const lineItems: AssetLineItem[] = state.cart.data.projects
      .reduce((assetsArr, project) => assetsArr.concat(project.lineItems), []);

    const asset: Asset = lineItems
      .find(lineItem => lineItem.id === loadParameters.uuid).asset;

    return this.extraLoadParametersFrom(asset);
  }

  private extraLoadParametersFrom(asset: Asset): AssetLoadParameters {
    return {
      id: String(asset.assetId),
      timeStart: String(asset.timeStart),
      timeEnd: String(asset.timeEnd)
    };
  }
}
