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
    .filter(([action, state]: [OrderActions.LoadSuccess, AppState]) => !!state.orderAsset.loadingUuid)
    .map(([action, state]: [OrderActions.LoadSuccess, AppState]) =>
      this.createNextActionFor(state.order.activeOrder, state.order.activeOrder.id, state.orderAsset.loadingUuid)
    );

  @Effect()
  public load: Observable<Action> = this.actions.ofType(OrderAssetActions.Load.Type)
    .withLatestFrom(this.store.select(state => state.order.activeOrder))
    .map(([action, order]: [OrderAssetActions.Load, Commerce.Order]) =>
      this.createNextActionFor(order, action.orderId, action.assetUuid)
    );

  constructor(private actions: Actions, private store: AppStore, private service: AssetService) { }

  private createNextActionFor(order: Commerce.Order, requestedOrderId: number, assetUuid: string): Action {
    return this.store.create(this.nextActionMapperFor(order, requestedOrderId, assetUuid));
  }

  private nextActionMapperFor(order: Commerce.Order, requestedOrderId: number, assetUuid: string): InternalActionFactoryMapper {
    if (order.id !== requestedOrderId) return factory => factory.order.load(requestedOrderId);

    const lineItem: Commerce.AssetLineItem = order.projects
      .reduce((allLineItems, project) => allLineItems.concat(project.lineItems), [])
      .find(lineItem => lineItem.id === assetUuid);

    if (lineItem) {
      const asset: Commerce.Asset = lineItem.asset;

      return factory => factory.orderAsset.loadAfterOrderAvailable({
        id: String(asset.assetId), uuid: assetUuid, timeStart: String(asset.timeStart), timeEnd: String(asset.timeEnd)
      });
    }

    return factory => factory.orderAsset.loadFailure({ status: 404 });
  }
}
