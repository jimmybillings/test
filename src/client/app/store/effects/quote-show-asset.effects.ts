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
    .map(([action, state]: [QuoteShowActions.LoadSuccess, AppState]) => {
      const loadParameters: Common.ChildAssetLoadParameters
        = this.createAssetLoadParametersFor(state.quoteShow.data, state.quoteShowAsset.loadingUuid);
      return this.store.create(factory => factory.quoteShowAsset.loadAfterQuoteAvailable(loadParameters));
    });

  @Effect()
  public load: Observable<Action> = this.actions.ofType(QuoteShowAssetActions.Load.Type)
    .withLatestFrom(this.store.select(state => state.quoteShow.data))
    .map(([action, quote]: [QuoteShowAssetActions.Load, Commerce.Quote]) => {
      let mapper: InternalActionFactoryMapper;
      if (quote.id !== action.quoteId) {
        mapper = (factory) => factory.quoteShow.load(action.quoteId);
      } else {
        const loadParameters: Common.ChildAssetLoadParameters = this.createAssetLoadParametersFor(quote, action.assetUuid);
        mapper = (factory) => factory.quoteShowAsset.loadAfterQuoteAvailable(loadParameters);
      }
      return this.store.create(mapper);
    });

  constructor(private actions: Actions, private store: AppStore, private service: AssetService) { }

  private createAssetLoadParametersFor(quote: Commerce.Quote, assetUuid: string): Common.ChildAssetLoadParameters {
    const lineItems: Commerce.AssetLineItem[] =
      quote.projects.reduce((assetsArr, project) => assetsArr.concat(project.lineItems), []);

    const asset: Commerce.Asset = lineItems.find(lineItem => lineItem.id === assetUuid).asset;

    return {
      id: String(asset.assetId),
      uuid: String(asset.uuid),
      timeStart: String(asset.timeStart),
      timeEnd: String(asset.timeEnd)
    };
  }
}
