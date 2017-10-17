import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';

import * as QuoteEditAssetActions from './quote-edit-asset.actions';
import * as QuoteEditActions from '../quote-edit/quote-edit.actions';
import * as Common from '../../shared/interfaces/common.interface';
import * as Commerce from '../../shared/interfaces/commerce.interface';
import { AppStore, AppState, InternalActionFactoryMapper } from '../../app.store';
import { AssetService } from '../asset/asset.service';

@Injectable()
export class QuoteEditAssetEffects {
  @Effect()
  public loadAfterQuoteAvailable: Observable<Action> = this.actions.ofType(QuoteEditAssetActions.LoadAfterQuoteAvailable.Type)
    .switchMap((action: QuoteEditAssetActions.LoadAfterQuoteAvailable) =>
      this.service.load(action.loadParameters)
        .map((asset: Common.Asset) => this.store.create(factory => factory.quoteEditAsset.loadSuccess(asset)))
        .catch(error => Observable.of(this.store.create(factory => factory.quoteEditAsset.loadFailure(error))))
    );

  @Effect() loadAssetOnQuoteLoadSuccess: Observable<Action> = this.actions.ofType(QuoteEditActions.LoadSuccess.Type)
    .withLatestFrom(this.store.select(state => state))
    .filter(([action, state]: [QuoteEditActions.LoadSuccess, AppState]) => !!state.quoteEditAsset.loadingUuid)
    .map(([action, state]: [QuoteEditActions.LoadSuccess, AppState]) =>
      this.createNextActionFor(state.quoteEdit.data, state.quoteEditAsset.loadingUuid)
    );

  @Effect()
  public load: Observable<Action> = this.actions.ofType(QuoteEditAssetActions.Load.Type)
    .withLatestFrom(this.store.select(state => state.quoteEdit.data))
    .map(([action, quote]: [QuoteEditAssetActions.Load, Commerce.Quote]) =>
      this.createNextActionFor(quote, action.assetUuid)
    );

  constructor(private actions: Actions, private store: AppStore, private service: AssetService) { }

  private createNextActionFor(quote: Commerce.Quote, assetUuid: string): Action {
    return this.store.create(this.nextActionMapperFor(quote, assetUuid));
  }

  private nextActionMapperFor(quote: Commerce.Quote, assetUuid: string): InternalActionFactoryMapper {
    if (quote.id === 0) return factory => factory.quoteEdit.load();

    const lineItem: Commerce.AssetLineItem = quote.projects
      .reduce((allLineItems, project) => allLineItems.concat(project.lineItems), [])
      .find(lineItem => lineItem.id === assetUuid);

    if (lineItem) {
      const asset: Commerce.Asset = lineItem.asset;

      return factory => factory.quoteEditAsset.loadAfterQuoteAvailable({
        id: String(asset.assetId), uuid: assetUuid, timeStart: String(asset.timeStart), timeEnd: String(asset.timeEnd)
      });
    }

    return factory => factory.quoteEditAsset.loadFailure({ status: 404 });
  }
}
