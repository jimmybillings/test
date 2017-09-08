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
    .filter(([action, state]: [OrderActions.LoadSuccess, AppState]) => state.orderAsset.loadingUuid !== null)
    .map(([action, state]: [OrderActions.LoadSuccess, AppState]) => {
      const loadParameters: Common.ChildAssetLoadParameters
        = this.createAssetLoadParametersFor(state.order.activeOrder, state.orderAsset.loadingUuid);
      return this.store.create(factory => factory.orderAsset.loadAfterOrderAvailable(loadParameters));
    });

  @Effect()
  public load: Observable<Action> = this.actions.ofType(OrderAssetActions.Load.Type)
    .withLatestFrom(this.store.select(state => state.order.activeOrder))
    .map(([action, order]: [OrderAssetActions.Load, Commerce.Order]) => {
      let mapper: InternalActionFactoryMapper;
      if (order.id !== action.orderId) {
        mapper = (factory) => factory.order.load(action.orderId);
      } else {
        const loadParameters: Common.ChildAssetLoadParameters = this.createAssetLoadParametersFor(order, action.assetUuid);
        mapper = (factory) => factory.orderAsset.loadAfterOrderAvailable(loadParameters);
      }
      return this.store.create(mapper);
    });

  constructor(private actions: Actions, private store: AppStore, private service: AssetService) { }

  private createAssetLoadParametersFor(order: Commerce.Order, assetUuid: string): Common.ChildAssetLoadParameters {
    const lineItems: Commerce.AssetLineItem[] =
      order.projects.reduce((assetsArr, project) => assetsArr.concat(project.lineItems), []);

    const asset: Commerce.Asset = lineItems.find(lineItem => lineItem.id === assetUuid).asset;

    return {
      id: String(asset.assetId),
      uuid: String(asset.uuid),
      timeStart: String(asset.timeStart),
      timeEnd: String(asset.timeEnd)
    };
  }
}
