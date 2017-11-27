import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';

import { WindowRef } from '../../shared/services/window-ref.service';
import { AppStore } from '../../app.store';
import { DeliveryOption } from '../../shared/interfaces/asset.interface';
import { Order } from '../../shared/interfaces/commerce.interface';
import { ActivityOptions, Asset } from '../../shared/interfaces/common.interface';
import { DeliveryOptionsService } from './delivery-options.service';
import * as DeliveryOptionsActions from './delivery-options.actions';

@Injectable()
export class DeliveryOptionsEffects {
  @Effect()
  public loadDeliveryOptions: Observable<Action> = this.actions.ofType(DeliveryOptionsActions.Load.Type)
    .switchMap((action: DeliveryOptionsActions.Load) =>
      this.service.getDeliveryOptions(action.activeAsset.assetId, action.shareKey)
        .map(options => this.store.create(factory => factory.deliveryOptions.loadSuccess(options)))
        .catch(error => Observable.of(this.store.create(factory => factory.deliveryOptions.loadFailure(error))))
    );

  @Effect()
  public deliver: Observable<Action> = this.actions.ofType(DeliveryOptionsActions.Deliver.Type)
    .withLatestFrom(this.store.select(state => state.deliveryOptions.activeAssetId))
    .switchMap(([action, assetId]: [DeliveryOptionsActions.Deliver, number]) =>
      this.service.deliverAsset(action.assetId, action.option.deliveryOptionId, action.markers)
        .mergeMap((order: Order) => [
          this.store.create(factory => factory.deliveryOptions.deliverySuccess(order.id)),
          this.store.create(factory => factory.activity.record(this.activityOptions(action.option, assetId)))
        ])
        .catch(error => Observable.of(this.store.create(factory => factory.deliveryOptions.deliveryFailure(error))))
    );

  @Effect()
  public deliverySuccess: Observable<Action> = this.actions.ofType(DeliveryOptionsActions.DeliverySuccess.Type)
    .map((action: DeliveryOptionsActions.DeliverySuccess) =>
      this.store.create(factory => factory.snackbar.display(
        'ASSET.DELIVERY_OPTIONS.DELIVERY_SUCCESS',
        { orderId: action.orderId }
      ))
    );

  @Effect()
  public deliveryFailure: Observable<Action> = this.actions.ofType(DeliveryOptionsActions.DeliveryFailure.Type)
    .map((action: DeliveryOptionsActions.DeliveryFailure) =>
      this.store.create(factory => factory.snackbar.display('ASSET.DELIVERY_OPTIONS.DELIVERY_ERROR'))
    );

  @Effect()
  public download: Observable<Action> = this.actions.ofType(DeliveryOptionsActions.Download.Type)
    .withLatestFrom(this.store.select(state => state.deliveryOptions.activeAssetId))
    .do(([action, assetId]: [DeliveryOptionsActions.Download, number]) => {
      this.window.nativeWindow.location.href = action.option.renditionUrl.url;
    })
    .map(([action, assetId]: [DeliveryOptionsActions.Download, number]) => {
      return this.store.create(factory => factory.activity.record(this.activityOptions(action.option, assetId)));
    });

  @Effect()
  public downloadViaAspera: Observable<Action> = this.actions.ofType(DeliveryOptionsActions.DownloadViaAspera.Type)
    .withLatestFrom(this.store.select(state => state.deliveryOptions.activeAssetId))
    .do(([action, assetId]: [DeliveryOptionsActions.Download, number]) => {
      this.service.initializeAsperaConnection(action.option.renditionUrl.asperaSpec);
    })
    .map(([action, assetId]: [DeliveryOptionsActions.Download, number]) => {
      return this.store.create(factory => factory.activity.record(this.activityOptions(action.option, assetId)));
    });

  constructor(
    private actions: Actions,
    private store: AppStore,
    private service: DeliveryOptionsService,
    private window: WindowRef
  ) { }

  private activityOptions(deliveryOption: DeliveryOption, assetId: number): ActivityOptions {
    return {
      activityName: deliveryOption.deliveryOptionLabel,
      activities: {
        assetId,
        transferType: deliveryOption.deliveryOptionTransferType,
        sourceUseType: deliveryOption.deliveryOptionUseType
      }
    };
  }
}
