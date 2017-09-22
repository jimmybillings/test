import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';

import * as QuoteEditActions from '../actions/quote-edit.actions';
import { FutureQuoteEditService } from '../services/quote-edit.service';
import { AppStore } from '../../app.store';
import { Quote, AssetLineItem } from '../../shared/interfaces/commerce.interface';

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
  public editLineItemMarkers: Observable<Action> = this.actions.ofType(QuoteEditActions.EditLineItemFromDetails.Type)
    .withLatestFrom(this.store.select(state => state.quoteEdit.data))
    .switchMap(([action, quote]: [QuoteEditActions.EditLineItemFromDetails, Quote]) => {
      const lineItemToEdit: AssetLineItem = this.findLineItemBy(action.uuid, quote);
      return this.service.editLineItem(quote.id, lineItemToEdit, action.markers, action.selectedAttributes)
        .map(quote => this.store.create(factory => factory.quoteEdit.editLineItemFromDetailsSuccess(quote)))
        .catch(error => Observable.of(this.store.create(factory => factory.quoteEdit.editLineItemFromDetailsFailure(error))));
    });

  @Effect()
  public showSnackbarOnEditLineItemSuccess: Observable<Action> =
  this.actions.ofType(QuoteEditActions.EditLineItemFromDetailsSuccess.Type).map(() => {
    return this.store.create(factory => factory.snackbar.display('Quote item has been updated'));
  });

  constructor(
    private actions: Actions,
    private store: AppStore,
    private service: FutureQuoteEditService
  ) { }

  private findLineItemBy(assetLineItemUuid: string, quote: Quote): AssetLineItem {
    return quote.projects
      .reduce((allLineItems, project) => allLineItems.concat(project.lineItems), [])
      .find(lineItem => lineItem.id === assetLineItemUuid);
  }
}
