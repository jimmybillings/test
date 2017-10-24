import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';

import { WindowRef } from '../../shared/services/window-ref.service';
import { AppStore } from '../../app.store';
import { DeliveryOption } from '../../shared/interfaces/asset.interface';
import { Order } from '../../shared/interfaces/commerce.interface';
import { Asset } from '../../shared/interfaces/common.interface';
import { DeliveryOptionsService } from './delivery-options.service';
import * as DeliveryOptionsActions from './delivery-options.actions';

@Injectable()
export class DeliveryOptionsEffects {
  @Effect()
  public loadDeliveryOptions: Observable<Action> = this.actions.ofType(DeliveryOptionsActions.Load.Type)
    .switchMap((action: DeliveryOptionsActions.Load) =>
      this.service.getDeliveryOptions(action.activeAsset.assetId)
        .map(options => this.store.create(factory => factory.deliveryOptions.loadSuccess(options)))
        .catch(error => Observable.of(this.store.create(factory => factory.deliveryOptions.loadFailure(error))))
    );

  @Effect()
  public deliver: Observable<Action> = this.actions.ofType(DeliveryOptionsActions.Deliver.Type)
    .switchMap((action: DeliveryOptionsActions.Deliver) =>
      this.service.deliverAsset(action.assetId, action.option.deliveryOptionId, action.markers)
        .map((order: Order) => this.store.create(factory => factory.deliveryOptions.deliverySuccess(order.id)))
        .catch(error => Observable.of(this.store.create(factory => factory.deliveryOptions.deliveryFailure(error))))
    );

  @Effect()
  public deliverySuccess: Observable<Action> = this.actions.ofType(DeliveryOptionsActions.DeliverySuccess.Type)
    .map((action: DeliveryOptionsActions.DeliverySuccess) =>
      this.store.create(factory => factory.snackbar.display('ASSET.DELIVERY_OPTIONS.DELIVERY_SUCCESS', { orderId: action.orderId }))
    );

  @Effect()
  public deliveryFailure: Observable<Action> = this.actions.ofType(DeliveryOptionsActions.DeliveryFailure.Type)
    .map((action: DeliveryOptionsActions.DeliveryFailure) =>
      this.store.create(factory => factory.snackbar.display('ASSET.DELIVERY_OPTIONS.DELIVERY_ERROR'))
    );

  @Effect({ dispatch: false })
  public download: Observable<Action> = this.actions.ofType(DeliveryOptionsActions.Download.Type)
    .do((action: DeliveryOptionsActions.Download) => this.window.nativeWindow.location.href = action.option.renditionUrl.url);

  @Effect({ dispatch: false })
  public downloadViaAspera: Observable<Action> = this.actions.ofType(DeliveryOptionsActions.DownloadViaAspera.Type)
    .do((action: DeliveryOptionsActions.Download) => this.service.initializeAsperaConnection(action.option.renditionUrl.url));

  constructor(
    private actions: Actions,
    private store: AppStore,
    private service: DeliveryOptionsService,
    private window: WindowRef
  ) { }
}
