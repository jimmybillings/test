import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';

import * as QuoteShowAssetActions from '../actions/quote-show-asset.actions';
import * as QuoteShowActions from '../actions/quote-show.actions';
import * as Common from '../../shared/interfaces/common.interface';
import * as Commerce from '../../shared/interfaces/commerce.interface';
import { AppStore, AppState, InternalActionFactoryMapper } from '../../app.store';
import { AssetService } from '../services/asset.service';

@Injectable()
export class QuoteShowAssetEffects {
  @Effect()
  public loadAfterQuoteAvailable: Observable<Action> = this.actions.ofType(QuoteShowAssetActions.LoadAfterQuoteAvailable.Type)
    .switchMap((action: QuoteShowAssetActions.LoadAfterQuoteAvailable) =>
      this.service.load(action.loadParameters)
        .map((asset: Common.Asset) => this.store.create(factory => factory.quoteShowAsset.loadSuccess(asset)))
        .catch(error => Observable.of(this.store.create(factory => factory.quoteShowAsset.loadFailure(error))))
    );

  @Effect() loadAssetOnQuoteLoadSuccess: Observable<Action> = this.actions.ofType(QuoteShowActions.LoadSuccess.Type)
    .withLatestFrom(this.store.select(state => state))
    .filter(([action, state]: [QuoteShowActions.LoadSuccess, AppState]) => state.quoteShowAsset.loadingUuid !== null)
    .map(([action, state]: [QuoteShowActions.LoadSuccess, AppState]) =>
      this.createNextActionFor(state.quoteShow.data, state.quoteShow.data.id, state.quoteShowAsset.loadingUuid)
    );

  @Effect()
  public load: Observable<Action> = this.actions.ofType(QuoteShowAssetActions.Load.Type)
    .withLatestFrom(this.store.select(state => state.quoteShow.data))
    .map(([action, quote]: [QuoteShowAssetActions.Load, Commerce.Quote]) =>
      this.createNextActionFor(quote, action.quoteId, action.assetUuid)
    );

  constructor(private actions: Actions, private store: AppStore, private service: AssetService) { }

  private createNextActionFor(quote: Commerce.Quote, requestedQuoteId: number, assetUuid: string): Action {
    return this.store.create(this.nextActionMapperFor(quote, requestedQuoteId, assetUuid));
  }

  private nextActionMapperFor(quote: Commerce.Quote, requestedQuoteId: number, assetUuid: string): InternalActionFactoryMapper {
    if (quote.id !== requestedQuoteId) return factory => factory.quoteShow.load(requestedQuoteId);

    const lineItem: Commerce.AssetLineItem = quote.projects
      .reduce((allLineItems, project) => allLineItems.concat(project.lineItems), [])
      .find(lineItem => lineItem.id === assetUuid);

    if (lineItem) {
      const asset: Commerce.Asset = lineItem.asset;

      return factory => factory.quoteShowAsset.loadAfterQuoteAvailable({
        id: String(asset.assetId), uuid: assetUuid, timeStart: String(asset.timeStart), timeEnd: String(asset.timeEnd)
      });
    }

    return factory => factory.quoteShowAsset.loadFailure({ status: 404 });
  }
}
