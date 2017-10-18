import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';

import { AppStore } from '../../app.store';
import { AssetService } from './asset.service';

import * as SearchAssetActions from '../search-asset/search-asset.actions';
import * as QuoteEditAssetActions from '../quote-edit-asset/quote-edit-asset.actions';
import * as QuoteShowAssetActions from '../quote-show-asset/quote-show-asset.actions';
import * as CartAssetActions from '../cart-asset/cart-asset.actions';
import * as ActiveCollectionAssetActions from '../active-collection-asset/active-collection-asset.actions';
import * as OrderAssetActions from '../order-asset/order-asset.actions';

@Injectable()
export class AssetEffects {
  // @Effect()
  // public getDeliveryOptionsOnLoadSuccess: Observable<Action> = this.actions.ofType(... this.loadSuccessActions)
  //   .switchMap((action: any) =>
  //     this.service.getDeliveryOptions(action.activeAsset.assetId)
  //       .map(res => this.store.create(factory => factory.asset.setDeliveryOptions(!!res.list)))
  //       .catch(error => Observable.of(this.store.create(factory => factory.asset.setDeliveryOptionsFailure(error))))
  //   );

  // @Effect()
  // public resetDeliveryOptionsOnLoad: Observable<Action> = this.actions.ofType(... this.loadActions)
  //   .map((action: any) =>
  //     this.store.create(factory => factory.asset.setDeliveryOptions(false))
  //   );

  private get loadActions(): Array<string> {
    return [
      SearchAssetActions.Load.Type,
      QuoteEditAssetActions.Load.Type,
      QuoteShowAssetActions.Load.Type,
      CartAssetActions.Load.Type,
      ActiveCollectionAssetActions.Load.Type,
      OrderAssetActions.Load.Type,
    ];
  };

  private get loadSuccessActions(): Array<string> {
    return [
      SearchAssetActions.LoadSuccess.Type,
      QuoteEditAssetActions.LoadSuccess.Type,
      QuoteShowAssetActions.LoadSuccess.Type,
      CartAssetActions.LoadSuccess.Type,
      ActiveCollectionAssetActions.LoadSuccess.Type,
      OrderAssetActions.LoadSuccess.Type,
    ];
  };

  constructor(private actions: Actions, private store: AppStore, private service: AssetService) { }
}
