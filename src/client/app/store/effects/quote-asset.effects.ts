import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';

import * as QuoteAssetActions from '../actions/quote-asset.actions';
import * as QuoteActions from '../actions/quote.actions';
import * as Common from '../../shared/interfaces/common.interface';
import * as Commerce from '../../shared/interfaces/commerce.interface';
import { AppStore, AppState, InternalActionFactoryMapper } from '../../app.store';
import { AssetService } from '../services/asset.service';

@Injectable()
export class QuoteAssetEffects {
  @Effect()
  public loadAfterQuoteAvailable: Observable<Action> = this.actions.ofType(QuoteAssetActions.LoadAfterQuoteAvailable.Type)
    .switchMap((action: QuoteAssetActions.LoadAfterQuoteAvailable) =>
      this.service.load(action.loadParameters)
        .map((asset: Common.Asset) => this.store.create(factory => factory.quoteAsset.loadSuccess(asset)))
        .catch(error => Observable.of(this.store.create(factory => factory.quoteAsset.loadFailure(error))))
    );

  @Effect() loadAssetOnQuoteLoadSuccess: Observable<Action> = this.actions.ofType(QuoteActions.LoadSuccess.Type)
    .withLatestFrom(this.store.select(state => state))
    .filter(([action, state]: [QuoteActions.LoadSuccess, AppState]) => state.quoteAsset.loadParameters !== null)
    .map(([action, state]: [QuoteActions.LoadSuccess, AppState]) => {
      const extraLoadParams: Common.QuoteAssetApiLoadParameters
        = this.mergeQuoteAssetWithLoadParameters(state.quote.data, state.quoteAsset.loadParameters);
      return this.store.create(factory => factory.quoteAsset.loadAfterQuoteAvailable(extraLoadParams));
    });

  @Effect()
  public load: Observable<Action> = this.actions.ofType(QuoteAssetActions.Load.Type)
    .withLatestFrom(this.store.select(state => state.quote.data))
    .map(([action, quote]: [QuoteAssetActions.Load, Commerce.Quote]) => {
      let mapper: InternalActionFactoryMapper;
      if (quote.id === 0) {
        mapper = (factory) => factory.quote.load();
      } else {
        const extraLoadParams: Common.QuoteAssetApiLoadParameters
          = this.mergeQuoteAssetWithLoadParameters(quote, action.loadParameters);
        mapper = (factory) => factory.quoteAsset.loadAfterQuoteAvailable(extraLoadParams);
      }
      return this.store.create(mapper);
    });

  constructor(
    private actions: Actions,
    private store: AppStore,
    private service: AssetService
  ) { }

  private mergeQuoteAssetWithLoadParameters(
    quote: Commerce.Quote,
    loadParameters: Common.QuoteAssetUrlLoadParameters
  ): Common.QuoteAssetApiLoadParameters {
    const lineItems: Commerce.AssetLineItem[] = quote.projects
      .reduce((assetsArr, project) => assetsArr.concat(project.lineItems), []);

    const asset: Commerce.Asset = lineItems
      .find(lineItem => lineItem.id === loadParameters.uuid).asset;

    return this.extraLoadParametersFrom(asset);
  }

  private extraLoadParametersFrom(asset: Commerce.Asset): Common.QuoteAssetApiLoadParameters {
    return {
      id: String(asset.assetId),
      uuid: String(asset.uuid),
      timeStart: String(asset.timeStart),
      timeEnd: String(asset.timeEnd)
    };
  }
}
