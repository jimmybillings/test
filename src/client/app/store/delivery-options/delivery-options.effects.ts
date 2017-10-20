import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';

import { AppStore } from '../../app.store';
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

  constructor(private actions: Actions, private store: AppStore, private service: DeliveryOptionsService) { }
}
