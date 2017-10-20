import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';

import { AppStore, AppState, InternalActionFactoryMapper } from '../../app.store';
import { AssetType } from '../../shared/interfaces/enhanced-asset';
import * as SubclipMarkersInterface from '../../shared/interfaces/subclip-markers';
import * as CommonI from '../../shared/interfaces/common.interface';
import * as Commerce from '../../shared/interfaces/commerce.interface';
import { Collection } from '../../shared/interfaces/collection.interface';
import { AssetService } from './asset.service';
import { Common } from '../../shared/utilities/common.functions';

import * as AssetActions from './asset.actions';
import * as CartActions from '../cart/cart.actions';
import * as OrderActions from '../order/order.actions';
import * as QuoteEditActions from '../quote-edit/quote-edit.actions';
import * as QuoteShowActions from '../quote-show/quote-show.actions';
import * as ActiveCollectionActions from '../active-collection/active-collection.actions';


@Injectable()
export class AssetEffects {
  /** Cart Asset Effects */
  @Effect()
  public loadAfterCartAvailable: Observable<Action> = this.actions.ofType(AssetActions.LoadAssetAfterCartAvailable.Type)
    .switchMap((action: AssetActions.LoadAssetAfterCartAvailable) =>
      this.service.load(action.loadParameters)
        .map((asset: Commerce.Asset) => this.store.create(factory => factory.asset.loadSuccess(asset)))
        .catch(error => Observable.of(this.store.create(factory => factory.asset.loadFailure(error))))
    );

  @Effect() loadAssetOnCartLoadSuccess: Observable<Action> = this.actions.ofType(CartActions.LoadSuccess.Type)
    .withLatestFrom(this.store.select(state => state))
    .filter(([action, state]: [CartActions.LoadSuccess, AppState]) => {
      return !!state.asset.loadingUuid && state.asset.activeAssetType === 'cartAsset';
    })
    .map(([action, state]: [CartActions.LoadSuccess, AppState]) =>
      this.createNextCartActionFor(state.cart.data, state.asset.loadingUuid)
    );

  @Effect()
  public loadCartAsset: Observable<Action> = this.actions.ofType(AssetActions.LoadCartAsset.Type)
    .withLatestFrom(this.store.select(state => state.cart.data))
    .map(([action, cart]: [AssetActions.LoadCartAsset, Commerce.Cart]) =>
      this.createNextCartActionFor(cart, action.uuid)
    );

  /** Active Collection Asset Effects */
  @Effect()
  public loadAssetAfterCollectionAvailable: Observable<Action> =
  this.actions.ofType(AssetActions.LoadAssetAfterCollectionAvailable.Type)
    .switchMap((action: AssetActions.LoadAssetAfterCollectionAvailable) =>
      this.service.load(action.loadParameters)
        .map((asset: CommonI.Asset) => this.store.create(factory => factory.asset.loadSuccess(asset)))
        .catch(error => Observable.of(this.store.create(factory => factory.asset.loadFailure(error))))
    );

  @Effect()
  public loadAssetOnCollectionLoadSuccess: Observable<Action> = this.actions.ofType(ActiveCollectionActions.LoadSuccess.Type)
    .withLatestFrom(this.store.select(state => state))
    .filter(([action, state]: [ActiveCollectionActions.LoadSuccess, AppState]) => {
      return !!state.asset.loadingUuid && state.asset.activeAssetType === 'collectionAsset';
    })
    .map(([action, state]: [ActiveCollectionActions.LoadSuccess, AppState]) =>
      this.createNextCollectionActionFor(state.activeCollection.collection, state.asset.loadingUuid)
    );

  @Effect()
  public loadActiveCollectionAsset: Observable<Action> = this.actions.ofType(AssetActions.LoadActiveCollectionAsset.Type)
    .withLatestFrom(this.store.select(state => state.activeCollection.collection))
    .map(([action, collection]: [AssetActions.LoadActiveCollectionAsset, Collection]) =>
      this.createNextCollectionActionFor(collection, action.uuid)
    );

  /** Order Asset Effects */
  @Effect()
  public loadAfterOrderAvailable: Observable<Action> = this.actions.ofType(AssetActions.LoadAssetAfterOrderAvailable.Type)
    .switchMap((action: AssetActions.LoadAssetAfterOrderAvailable) =>
      this.service.load(action.loadParameters)
        .map((asset: CommonI.Asset) => this.store.create(factory => factory.asset.loadSuccess(asset)))
        .catch(error => Observable.of(this.store.create(factory => factory.asset.loadFailure(error))))
    );

  @Effect() loadAssetOnOrderLoadSuccess: Observable<Action> = this.actions.ofType(OrderActions.LoadSuccess.Type)
    .withLatestFrom(this.store.select(state => state))
    .filter(([action, state]: [OrderActions.LoadSuccess, AppState]) => {
      return !!state.asset.loadingUuid && state.asset.activeAssetType === 'orderAsset';
    })
    .map(([action, state]: [OrderActions.LoadSuccess, AppState]) =>
      this.createNextOrderActionFor(state.order.activeOrder, state.order.activeOrder.id, state.asset.loadingUuid)
    );

  @Effect()
  public loadOrderAsset: Observable<Action> = this.actions.ofType(AssetActions.LoadOrderAsset.Type)
    .withLatestFrom(this.store.select(state => state.order.activeOrder))
    .map(([action, order]: [AssetActions.LoadOrderAsset, Commerce.Order]) =>
      this.createNextOrderActionFor(order, action.orderId, action.uuid)
    );

  /** Quote Edit Asset Effect */
  @Effect()
  public loadAfterQuoteAvailable: Observable<Action> = this.actions.ofType(AssetActions.LoadAssetAfterQuoteAvailable.Type)
    .switchMap((action: AssetActions.LoadAssetAfterQuoteAvailable) =>
      this.service.load(action.loadParameters)
        .map((asset: CommonI.Asset) => this.store.create(factory => factory.asset.loadSuccess(asset)))
        .catch(error => Observable.of(this.store.create(factory => factory.asset.loadFailure(error))))
    );

  @Effect() loadAssetOnQuoteLoadSuccess: Observable<Action> = this.actions.ofType(QuoteEditActions.LoadSuccess.Type)
    .withLatestFrom(this.store.select(state => state))
    .filter(([action, state]: [QuoteEditActions.LoadSuccess, AppState]) => {
      return !!state.asset.loadingUuid && state.asset.activeAssetType === 'quoteEditAsset';
    })
    .map(([action, state]: [QuoteEditActions.LoadSuccess, AppState]) =>
      this.createNextQuoteEditActionFor(state.quoteEdit.data, state.asset.loadingUuid)
    );

  @Effect()
  public loadQuoteEditAsset: Observable<Action> = this.actions.ofType(AssetActions.LoadQuoteEditAsset.Type)
    .withLatestFrom(this.store.select(state => state.quoteEdit.data))
    .map(([action, quote]: [AssetActions.LoadQuoteEditAsset, Commerce.Quote]) =>
      this.createNextQuoteEditActionFor(quote, action.uuid)
    );

  /** Quote Show Asset Effects */
  @Effect() loadAssetOnQuoteShowLoadSuccess: Observable<Action> = this.actions.ofType(QuoteShowActions.LoadSuccess.Type)
    .withLatestFrom(this.store.select(state => state))
    .filter(([action, state]: [QuoteShowActions.LoadSuccess, AppState]) => {
      return !!state.asset.loadingUuid && state.asset.activeAssetType === 'quoteShowAsset';
    })
    .map(([action, state]: [QuoteShowActions.LoadSuccess, AppState]) =>
      this.createNextQuoteShowActionFor(state.quoteShow.data, state.quoteShow.data.id, state.asset.loadingUuid)
    );

  @Effect()
  public loadQuoteShowAsset: Observable<Action> = this.actions.ofType(AssetActions.LoadQuoteShowAsset.Type)
    .withLatestFrom(this.store.select(state => state.quoteShow.data))
    .map(([action, quote]: [AssetActions.LoadQuoteShowAsset, Commerce.Quote]) =>
      this.createNextQuoteShowActionFor(quote, action.quoteId, action.uuid)
    );

  /** Search Asset Effects */
  @Effect()
  public load: Observable<Action> = this.actions.ofType(AssetActions.LoadSearchAsset.Type)
    .switchMap((action: AssetActions.LoadSearchAsset) =>
      this.service.load(action.loadParameters)
        .map((asset: CommonI.Asset) => this.store.create(factory => factory.asset.loadSuccess(asset)))
        .catch(error => Observable.of(this.store.create(factory => factory.asset.loadFailure(error))))
    );

  @Effect()
  public updateMarkersInUrl: Observable<Action> = this.actions.ofType(AssetActions.UpdateMarkersInUrl.Type)
    .map((action: AssetActions.UpdateMarkersInUrl) => {
      const duration: SubclipMarkersInterface.Duration = SubclipMarkersInterface.durationFrom(action.markers);
      let updatedTimeStart: number = duration.timeStart;
      let updatedTimeEnd: number = duration.timeEnd;
      if (updatedTimeEnd < 0) updatedTimeEnd = undefined;
      if (updatedTimeStart < 0) updatedTimeStart = undefined;
      return this.store.create(factory => factory.router.addMarkersToUrl(action.assetId, updatedTimeStart, updatedTimeEnd));
    });

  constructor(private actions: Actions, private store: AppStore, private service: AssetService) { }

  private createNextQuoteShowActionFor(quote: Commerce.Quote, requestedQuoteId: number, assetUuid: string): Action {
    return this.store.create(this.nextQuoteShowActionMapperFor(quote, requestedQuoteId, assetUuid));
  }

  private nextQuoteShowActionMapperFor(
    quote: Commerce.Quote,
    requestedQuoteId: number,
    assetUuid: string
  ): InternalActionFactoryMapper {
    if (quote.id !== requestedQuoteId) return factory => factory.quoteShow.load(requestedQuoteId);

    const lineItem: Commerce.AssetLineItem = quote.projects
      .reduce((allLineItems, project) => allLineItems.concat(project.lineItems), [])
      .find(lineItem => lineItem.id === assetUuid);

    if (lineItem) {
      const asset: Commerce.Asset = lineItem.asset;

      return factory => factory.asset.loadAfterQuoteAvailable({
        id: String(asset.assetId), uuid: assetUuid, timeStart: String(asset.timeStart), timeEnd: String(asset.timeEnd)
      });
    }

    return factory => factory.asset.loadFailure({ status: 404 });
  }
  private createNextQuoteEditActionFor(quote: Commerce.Quote, assetUuid: string): Action {
    return this.store.create(this.nextQuoteEditActionMapperFor(quote, assetUuid));
  }

  private nextQuoteEditActionMapperFor(quote: Commerce.Quote, assetUuid: string): InternalActionFactoryMapper {
    if (quote.id === 0) return factory => factory.quoteEdit.load();

    const lineItem: Commerce.AssetLineItem = quote.projects
      .reduce((allLineItems, project) => allLineItems.concat(project.lineItems), [])
      .find(lineItem => lineItem.id === assetUuid);

    if (lineItem) {
      const asset: Commerce.Asset = lineItem.asset;

      return factory => factory.asset.loadAssetAfterQuoteAvailable({
        id: String(asset.assetId), uuid: assetUuid, timeStart: String(asset.timeStart), timeEnd: String(asset.timeEnd)
      });
    }

    return factory => factory.asset.loadFailure({ status: 404 });
  }

  private createNextOrderActionFor(order: Commerce.Order, requestedOrderId: number, assetUuid: string): Action {
    return this.store.create(this.orderActionMapperFor(order, requestedOrderId, assetUuid));
  }

  private orderActionMapperFor(order: Commerce.Order, requestedOrderId: number, assetUuid: string): InternalActionFactoryMapper {
    if (order.id !== requestedOrderId) return factory => factory.order.load(requestedOrderId);

    const lineItem: Commerce.AssetLineItem = order.projects
      .reduce((allLineItems, project) => allLineItems.concat(project.lineItems), [])
      .find(lineItem => lineItem.id === assetUuid);

    if (lineItem) {
      const asset: Commerce.Asset = lineItem.asset;

      return factory => factory.asset.loadAssetAfterOrderAvailable({
        id: String(asset.assetId), uuid: assetUuid, timeStart: String(asset.timeStart), timeEnd: String(asset.timeEnd)
      });
    }

    return factory => factory.asset.loadFailure({ status: 404 });
  }

  private createNextCartActionFor(cart: Commerce.Cart, assetUuid: string): Action {
    return this.store.create(this.nextCartActionMapperFor(cart, assetUuid));
  }

  private nextCartActionMapperFor(cart: Commerce.Cart, assetUuid: string): InternalActionFactoryMapper {
    if (cart.id === null) return factory => factory.cart.load();

    const lineItem: Commerce.AssetLineItem = cart.projects
      .reduce((allLineItems, project) => allLineItems.concat(project.lineItems), [])
      .find(lineItem => lineItem.id === assetUuid);

    if (lineItem) {
      const asset: Commerce.Asset = lineItem.asset;

      return factory => factory.asset.loadAssetAfterCartAvailable({
        id: String(asset.assetId), uuid: assetUuid, timeStart: String(asset.timeStart), timeEnd: String(asset.timeEnd)
      });
    }

    return factory => factory.asset.loadFailure({ status: 404 });
  }

  private createNextCollectionActionFor(collection: Collection, assetUuid: string): Action {
    return this.store.create(this.nextCollectionActionMapperFor(collection, assetUuid));
  }

  private nextCollectionActionMapperFor(collection: Collection, assetUuid: string): InternalActionFactoryMapper {
    if (collection.id === null) return factory => factory.activeCollection.load();

    const asset: CommonI.Asset = collection.assets.items.find(asset => asset.uuid === assetUuid);

    if (asset) return factory => factory.asset.loadAssetAfterCollectionAvailable({
      id: String(asset.assetId), uuid: assetUuid, timeStart: String(asset.timeStart), timeEnd: String(asset.timeEnd)
    });

    return factory => factory.asset.loadFailure({ status: 404 });
  }
}
