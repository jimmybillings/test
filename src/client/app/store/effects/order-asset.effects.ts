import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';

import * as OrderAssetActions from '../actions/order-asset.actions';
import * as OrderActions from '../actions/order.actions';
import * as Common from '../../shared/interfaces/common.interface';
import * as Commerce from '../../shared/interfaces/commerce.interface';
import { AppStore, AppState, InternalActionFactoryMapper } from '../../app.store';
import { AssetService } from '../services/asset.service';

@Injectable()
export class OrderAssetEffects {
  @Effect()
  public loadAfterOrderAvailable: Observable<Action> = this.actions.ofType(OrderAssetActions.LoadAfterOrderAvailable.Type)
    .switchMap((action: OrderAssetActions.LoadAfterOrderAvailable) =>
      this.service.load(action.loadParameters)
        .map((asset: Common.Asset) => this.store.create(factory => factory.orderAsset.loadSuccess(asset)))
        .catch(error => Observable.of(this.store.create(factory => factory.orderAsset.loadFailure(error))))
    );

  @Effect() loadAssetOnOrderLoadSuccess: Observable<Action> = this.actions.ofType(OrderActions.LoadSuccess.Type)
    .withLatestFrom(this.store.select(state => state))
    .filter(([action, state]: [OrderActions.LoadSuccess, AppState]) => state.orderAsset.loadParameters !== null)
    .map(([action, state]: [OrderActions.LoadSuccess, AppState]) => {
      const extraLoadParams: Common.OrderAssetApiLoadParameters
        = this.mergeOrderAssetWithLoadParameters(state.order.activeOrder, state.orderAsset.loadParameters);
      return this.store.create(factory => factory.orderAsset.loadAfterOrderAvailable(extraLoadParams));
    });

  @Effect()
  public load: Observable<Action> = this.actions.ofType(OrderAssetActions.Load.Type)
    .withLatestFrom(this.store.select(state => state.order.activeOrder))
    .map(([action, order]: [OrderAssetActions.Load, Commerce.Order]) => {
      let mapper: InternalActionFactoryMapper;
      if (order.id !== action.orderId) {
        mapper = (factory) => factory.order.load(action.orderId);
      } else {
        const extraLoadParams: Common.OrderAssetApiLoadParameters
          = this.mergeOrderAssetWithLoadParameters(order, action.loadParameters);
        mapper = (factory) => factory.orderAsset.loadAfterOrderAvailable(extraLoadParams);
      }
      return this.store.create(mapper);
    });

  constructor(
    private actions: Actions,
    private store: AppStore,
    private service: AssetService
  ) { }

  private mergeOrderAssetWithLoadParameters(
    order: Commerce.Order,
    loadParameters: Common.OrderAssetUrlLoadParameters
  ): Common.OrderAssetApiLoadParameters {
    const lineItems: Commerce.AssetLineItem[] = order.projects
      .reduce((assetsArr, project) => assetsArr.concat(project.lineItems), []);

    const asset: Commerce.Asset = lineItems
      .find(lineItem => lineItem.id === loadParameters.uuid).asset;

    return this.extraLoadParametersFrom(asset);
  }

  private extraLoadParametersFrom(asset: Commerce.Asset): Common.OrderAssetApiLoadParameters {
    return {
      id: String(asset.assetId),
      uuid: String(asset.uuid),
      timeStart: String(asset.timeStart),
      timeEnd: String(asset.timeEnd)
    };
  }
}
