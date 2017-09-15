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
    .filter(([action, state]: [QuoteEditActions.LoadSuccess, AppState]) => state.quoteEditAsset.loadingUuid !== null)
    .map(([action, state]: [QuoteEditActions.LoadSuccess, AppState]) => {
      const loadParameters: Common.ChildAssetLoadParameters
        = this.createAssetLoadParametersFor(state.quoteEdit.data, state.quoteEditAsset.loadingUuid);
      return this.store.create(factory => factory.quoteEditAsset.loadAfterQuoteAvailable(loadParameters));
    });

  @Effect()
  public load: Observable<Action> = this.actions.ofType(QuoteEditAssetActions.Load.Type)
    .withLatestFrom(this.store.select(state => state.quoteEdit.data))
    .map(([action, quote]: [QuoteEditAssetActions.Load, Commerce.Quote]) => {
      let mapper: InternalActionFactoryMapper;
      if (quote.id === 0) {
        mapper = (factory) => factory.quoteEdit.load();
      } else {
        const loadParameters: Common.ChildAssetLoadParameters = this.createAssetLoadParametersFor(quote, action.assetUuid);
        mapper = (factory) => factory.quoteEditAsset.loadAfterQuoteAvailable(loadParameters);
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
      uuid: assetUuid,
      timeStart: String(asset.timeStart),
      timeEnd: String(asset.timeEnd)
    };
  }
}
