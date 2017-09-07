import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';

import * as QuoteEditAssetActions from '../actions/quote-edit-asset.actions';
import * as QuoteEditActions from '../actions/quote-edit.actions';
import * as Common from '../../shared/interfaces/common.interface';
import * as Commerce from '../../shared/interfaces/commerce.interface';
import { AppStore, AppState, InternalActionFactoryMapper } from '../../app.store';
import { AssetService } from '../services/asset.service';

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
    .filter(([action, state]: [QuoteEditActions.LoadSuccess, AppState]) => state.quoteEditAsset.loadParameters !== null)
    .map(([action, state]: [QuoteEditActions.LoadSuccess, AppState]) => {
      const extraLoadParams: Common.QuoteAssetApiLoadParameters
        = this.mergeQuoteAssetWithLoadParameters(state.quoteEdit.data, state.quoteEditAsset.loadParameters);
      return this.store.create(factory => factory.quoteEditAsset.loadAfterQuoteAvailable(extraLoadParams));
    });

  @Effect()
  public load: Observable<Action> = this.actions.ofType(QuoteEditAssetActions.Load.Type)
    .withLatestFrom(this.store.select(state => state.quoteEdit.data))
    .map(([action, quote]: [QuoteEditAssetActions.Load, Commerce.Quote]) => {
      let mapper: InternalActionFactoryMapper;
      if (quote.id === 0) {
        mapper = (factory) => factory.quoteEdit.load();
      } else {
        const extraLoadParams: Common.QuoteAssetApiLoadParameters
          = this.mergeQuoteAssetWithLoadParameters(quote, action.loadParameters);
        mapper = (factory) => factory.quoteEditAsset.loadAfterQuoteAvailable(extraLoadParams);
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
