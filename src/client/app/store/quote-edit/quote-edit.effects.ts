import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';

import * as QuoteEditActions from './quote-edit.actions';
import { FutureQuoteEditService } from './quote-edit.service';
import { AppStore } from '../../app.store';
import { Quote, AssetLineItem } from '../../shared/interfaces/commerce.interface';
import { Router } from '@angular/router';

@Injectable()
export class QuoteEditEffects {
  @Effect()
  public load: Observable<Action> = this.actions.ofType(QuoteEditActions.Load.Type)
    .switchMap(() => this.service.load()
      .map(quote => this.store.create(factory => factory.quoteEdit.loadSuccess(quote)))
      .catch(error => Observable.of(this.store.create(factory => factory.quoteEdit.loadFailure(error))))
    );

  @Effect()
  public delete: Observable<Action> = this.actions.ofType(QuoteEditActions.Delete.Type)
    .withLatestFrom(this.store.select(state => state.quoteEdit.data.id))
    .switchMap(([action, quoteId]: [QuoteEditActions.Delete, number]) => this.service.delete(quoteId)
      .map(quote => this.store.create(factory => factory.quoteEdit.deleteSuccess(quote)))
      .catch(error => Observable.of(this.store.create(factory => factory.quoteEdit.deleteFailure(error))))
    );

  @Effect()
  public changeRouteOnDeleteSuccess: Observable<Action> = this.actions.ofType(QuoteEditActions.DeleteSuccess.Type)
    .map(() => this.store.create(factory => factory.router.goToQuotes()));

  @Effect()
  public editLineItemFromDetails: Observable<Action> = this.actions.ofType(QuoteEditActions.EditLineItemFromDetails.Type)
    .withLatestFrom(this.store.select(state => state.quoteEdit.data))
    .switchMap(([action, quote]: [QuoteEditActions.EditLineItemFromDetails, Quote]) => {
      const lineItemToEdit: AssetLineItem = this.findLineItemBy(action.uuid, quote);
      return this.service.editLineItem(quote.id, lineItemToEdit, action.markers, action.attributes)
        .map(quote => this.store.create(factory => factory.quoteEdit.editLineItemFromDetailsSuccess(quote)))
        .catch(error => Observable.of(this.store.create(factory => factory.quoteEdit.editLineItemFromDetailsFailure(error))));
    });

  @Effect()
  public showSnackbarOnEditLineItemSuccess: Observable<Action> =
  this.actions.ofType(QuoteEditActions.EditLineItemFromDetailsSuccess.Type).map(() => {
    return this.store.create(factory => factory.snackbar.display('ASSET.DETAIL.QUOTE_ITEM_UPDATED'));
  });

  @Effect()
  public removeAsset: Observable<Action> = this.actions.ofType(QuoteEditActions.RemoveAsset.Type)
    .withLatestFrom(this.store.select(state => state.quoteEdit.data.id))
    .switchMap(([action, quoteId]: [QuoteEditActions.RemoveAsset, number]) =>
      this.service.removeAsset(quoteId, action.asset)
        .map((quote: Quote) => this.store.create(factory => factory.quoteEdit.removeAssetSuccess(quote)))
        .catch(error => Observable.of(this.store.create(factory => factory.quoteEdit.removeAssetFailure(error))))
    );

  @Effect()
  public showSnackbarOnRemoveAssetSuccess: Observable<Action> =
  this.actions.ofType(QuoteEditActions.RemoveAssetSuccess.Type).map((action: QuoteEditActions.RemoveAssetSuccess) =>
    this.store.create(factory => factory.snackbar.display('QUOTE.REMOVE_ASSET.SUCCESS'))
  );

  @Effect()
  public changeRouteOnRemoveAssetSuccess: Observable<Action> =
  this.actions.ofType(QuoteEditActions.RemoveAssetSuccess.Type).map((action: QuoteEditActions.RemoveAssetSuccess) =>
    this.store.create(factory => factory.router.goToActiveQuote())
  );

  @Effect()
  public addCustomPriceToLineItem: Observable<Action> = this.actions.ofType(QuoteEditActions.AddCustomPriceToLineItem.Type)
    .withLatestFrom(this.store.select(state => state.quoteEdit.data.id))
    .switchMap(([action, quoteId]: [QuoteEditActions.AddCustomPriceToLineItem, number]) => {
      return this.service.addCustomPriceToLineItem(quoteId, action.lineItem, action.price)
        .map(quote => this.store.create(factory => factory.quoteEdit.addCustomPriceToLineItemSuccess(quote)))
        .catch(error => Observable.of(this.store.create(factory => factory.quoteEdit.addCustomPriceToLineItemFailure(error))));
    });

  @Effect()
  public sendQuote: Observable<Action> = this.actions
    .ofType(QuoteEditActions.SendQuote.Type)
    .withLatestFrom(this.store.select(state => state.quoteEdit.data.id))
    .switchMap(([action, quoteId]: [QuoteEditActions.SendQuote, number]) =>

      this.service.sendQuote(quoteId, action.quoteOptions)
        .map(() =>
          this.store.create(factory =>
            factory.quoteEdit.sendQuoteSuccess(
              quoteId,
              action.quoteOptions.ownerEmail
            )
          )
        )
        .catch(error =>
          Observable.of(this.store.create(factory =>
            factory.error.handle(error)
          ))
        )
    );

  @Effect()
  public sendQuoteSuccess: Observable<Action> = this.actions
    .ofType(QuoteEditActions.SendQuoteSuccess.Type)
    .mergeMap((action: QuoteEditActions.SendQuoteSuccess) => {
      return [
        this.store.create(factory =>
          factory.router.goToQuotesById(action.quoteId)
        ),
        this.store.create(factory =>
          factory.snackbar.display('QUOTE.CREATED_FOR_TOAST', { emailAddress: action.ownerEmail })
        )];
    });

  constructor(
    private actions: Actions,
    private store: AppStore,
    private service: FutureQuoteEditService,
  ) { }

  private findLineItemBy(assetLineItemUuid: string, quote: Quote): AssetLineItem {
    return quote.projects
      .reduce((allLineItems, project) => allLineItems.concat(project.lineItems), [])
      .find(lineItem => lineItem.id === assetLineItemUuid);
  }
}
