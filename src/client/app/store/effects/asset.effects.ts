import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';

import { AppStore } from '../../app.store';
import { AssetService } from '../services/asset.service';

import * as SearchAssetActions from '../actions/search-asset.actions';
import * as QuoteEditAssetActions from '../actions/quote-edit-asset.actions';
import * as QuoteShowAssetActions from '../actions/quote-show-asset.actions';
import * as CartAssetActions from '../actions/cart-asset.actions';
import * as ActiveCollectionAssetActions from '../actions/active-collection-asset.actions';
import * as OrderAssetActions from '../actions/order-asset.actions';

@Injectable()
export class AssetEffects {
  public loadSuccessActions: any = [
    SearchAssetActions.LoadSuccess.Type,
    QuoteEditAssetActions.LoadSuccess.Type,
    QuoteShowAssetActions.LoadSuccess.Type,
    CartAssetActions.LoadSuccess.Type,
    ActiveCollectionAssetActions.LoadSuccess.Type,
    OrderAssetActions.LoadSuccess.Type,
  ];

  public loadActions: any = [
    SearchAssetActions.Load.Type,
    QuoteEditAssetActions.Load.Type,
    QuoteShowAssetActions.Load.Type,
    CartAssetActions.Load.Type,
    ActiveCollectionAssetActions.Load.Type,
    OrderAssetActions.Load.Type,
  ];

  @Effect()
  public getDeliveryOptionsOnLoadSuccess: Observable<Action> = this.actions.ofType(... this.loadSuccessActions)
    .switchMap((action: any) =>
      this.service.getDeliveryOptions(action.activeAsset.assetId)
        .map(res => this.store.create(factory => factory.asset.setDeliveryOptions(!!res.list)))
        .catch(error => Observable.of(this.store.create(factory => factory.asset.setDeliveryOptionsFailure(error))))
    );

  @Effect()
  public resetDeliveryOptionsOnLoad: Observable<Action> = this.actions.ofType(... this.loadActions)
    .map((action: any) =>
      this.store.create(factory => factory.asset.setDeliveryOptions(false))
    );

  constructor(private actions: Actions, private store: AppStore, private service: AssetService) { }
}
