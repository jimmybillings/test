import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';

import { AppStore } from '../../app.store';
import { AssetService } from './asset.service';

import * as AssetActions from './asset.actions';
import * as SearchAssetActions from '../search-asset/search-asset.actions';
import * as QuoteEditAssetActions from '../quote-edit-asset/quote-edit-asset.actions';
import * as QuoteShowAssetActions from '../quote-show-asset/quote-show-asset.actions';
import * as CartAssetActions from '../cart-asset/cart-asset.actions';
import * as ActiveCollectionAssetActions from '../active-collection-asset/active-collection-asset.actions';

export type DeliveryOptionLoadAction =
  SearchAssetActions.LoadSuccess |
  QuoteEditAssetActions.LoadSuccess |
  QuoteShowAssetActions.LoadSuccess |
  CartAssetActions.LoadSuccess |
  ActiveCollectionAssetActions.LoadSuccess |
  AssetActions.LoadDeliveryOptions;

@Injectable()
export class AssetEffects {
  @Effect()
  public loadDeliveryOptions: Observable<Action> = this.actions.ofType(...this.allowableLoadActions)
    .switchMap((action: DeliveryOptionLoadAction) =>
      this.service.getDeliveryOptions(action.activeAsset.assetId)
        .map(options => this.store.create(factory => factory.asset.loadDeliveryOptionsSuccess(options)))
        .catch(error => Observable.of(this.store.create(factory => factory.asset.loadDeliveryOptionsFailure(error))))
    );

  private get allowableLoadActions(): Array<string> {
    return [
      SearchAssetActions.LoadSuccess.Type,
      QuoteEditAssetActions.LoadSuccess.Type,
      QuoteShowAssetActions.LoadSuccess.Type,
      CartAssetActions.LoadSuccess.Type,
      ActiveCollectionAssetActions.LoadSuccess.Type,
      AssetActions.LoadDeliveryOptions.Type
    ];
  };

  constructor(private actions: Actions, private store: AppStore, private service: AssetService) { }
}
