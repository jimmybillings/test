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
      return this.service.editLineItemFromDetails(quote.id, lineItemToEdit, action.markers, action.attributes)
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
          factory.router.goToQuoteById(action.quoteId)
        ),
        this.store.create(factory =>
          factory.snackbar.display(
            'QUOTE.CREATED_FOR_TOAST',
            { emailAddress: action.ownerEmail }
          )
        )];
    });

  @Effect()
  public cloneQuote: Observable<Action> = this.actions
    .ofType(QuoteEditActions.CloneQuote.Type)
    .switchMap((action: QuoteEditActions.CloneQuote) =>

      this.service.cloneQuote(action.quote)
        .map((quote) =>
          this.store.create(factory => factory.quoteEdit.cloneQuoteSuccess(quote))
        )
    );

  @Effect()
  public cloneQuoteSuccess: Observable<Action> = this.actions
    .ofType(QuoteEditActions.CloneQuoteSuccess.Type)
    .mergeMap(() => {
      return [
        this.store.create(factory => factory.router.goToActiveQuote()),
        this.store.create(factory => factory.snackbar.display('QUOTE.UPDATED'))
      ];
    });

  @Effect()
  public createQuote: Observable<Action> = this.actions
    .ofType(QuoteEditActions.CreateQuote.Type)
    .switchMap((action: QuoteEditActions.CloneQuote) =>

      this.service.createQuote()
        .map((quote) =>
          this.store.create(factory =>
            factory.quoteEdit.quoteRefreshAndNotfiy(quote, 'QUOTE.UPDATED')
          )
        )
    );

  @Effect()
  public UpdateQuoteFields: Observable<Action> = this.actions
    .ofType(QuoteEditActions.UpdateQuoteFields.Type)
    .withLatestFrom(this.store.select(state => state.quoteEdit.data))
    .switchMap(([action, quote]: [QuoteEditActions.UpdateQuoteFields, Quote]) =>
      this.service.updateQuoteField(action.options, quote)
        .map((quote) => this.store.create(factory =>
          factory.quoteEdit.quoteRefreshAndNotfiy(quote, 'QUOTE.UPDATED'))
        )
    );

  @Effect()
  public AddFeeTo: Observable<Action> = this.actions
    .ofType(QuoteEditActions.AddFeeTo.Type)
    .withLatestFrom(this.store.select(state => state.quoteEdit.data.id))
    .switchMap(([action, quoteId]: [QuoteEditActions.AddFeeTo, number]) =>
      this.service.addFeeTo(quoteId, action.project, action.fee)
        .map((quote) => this.store.create(factory =>
          factory.quoteEdit.quoteRefreshAndNotfiy(quote, 'QUOTE.UPDATED'))
        )
    );

  @Effect()
  public RemoveFee: Observable<Action> = this.actions
    .ofType(QuoteEditActions.RemoveFee.Type)
    .withLatestFrom(this.store.select(state => state.quoteEdit.data.id))
    .switchMap(([action, quoteId]: [QuoteEditActions.AddFeeTo, number]) =>
      this.service.removeFee(quoteId, action.fee)
        .map((quote) => this.store.create(factory =>
          factory.quoteEdit.quoteRefreshAndNotfiy(quote, 'QUOTE.UPDATED'))
        )
    );

  @Effect()
  public bulkImport: Observable<Action> = this.actions
    .ofType(QuoteEditActions.BulkImport.Type)
    .withLatestFrom(this.store.select(state => state.quoteEdit.data.id))
    .switchMap(([action, quoteId]: [QuoteEditActions.BulkImport, number]) =>
      this.service.bulkImport(quoteId, action.rawAssets, action.projectId)
        .map((quote) => this.store.create(factory =>
          factory.quoteEdit.bulkImportSuccess(quote, action.rawAssets))
        )
    );

  @Effect()
  public bulkImportSuccess: Observable<Action> = this.actions
    .ofType(QuoteEditActions.BulkImportSuccess.Type)
    .map((action: QuoteEditActions.BulkImportSuccess) =>
      this.store.create(factory => factory.snackbar.display(
        'QUOTE.BULK_IMPORT.CONFIRMATION',
        { numOfAssets: action.rawAssets.lineItemAttributes.split('\n').length })
      )
    );

  @Effect()
  public editLineItem: Observable<Action> = this.actions
    .ofType(QuoteEditActions.EditLineItem.Type)
    .withLatestFrom(this.store.select(state => state.quoteEdit.data.id))
    .switchMap(([action, quoteId]: [QuoteEditActions.EditLineItem, number]) =>
      this.service.editLineItem(quoteId, action.lineItem, action.fieldToEdit)
        .map((quote) => this.store.create(factory =>
          factory.quoteEdit.quoteRefreshAndNotfiy(quote, 'QUOTE.UPDATED'))
        )
    );

  @Effect()
  public addAssetToProjectInQuote: Observable<Action> = this.actions
    .ofType(QuoteEditActions.AddAssetToProjectInQuote.Type)
    .withLatestFrom(this.store.select(state => state.quoteEdit.data))
    .switchMap(([action, quote]: [QuoteEditActions.AddAssetToProjectInQuote, Quote]) => {
      let existingProjects = (quote.projects || []).map((project: any) => project.name);
      return this.service.addAssetToProjectInQuote(quote.id, existingProjects, action.parameters)
        .map((quote) => this.store.create(factory =>
          factory.quoteEdit.addAssetToProjectInQuoteSuccess(quote, action.parameters.lineItem.asset.assetId))
        );
    });

  @Effect()
  public addAssetToProjectInQuoteSuccess: Observable<Action> = this.actions
    .ofType(QuoteEditActions.AddAssetToProjectInQuoteSuccess.Type)
    .map((action: QuoteEditActions.AddAssetToProjectInQuoteSuccess) =>
      this.store.create(factory =>
        factory.snackbar.display('ASSET.ADD_TO_QUOTE_TOAST', { assetId: action.assetId })
      )
    );

  @Effect()
  public addProject: Observable<Action> = this.actions
    .ofType(QuoteEditActions.AddProject.Type)
    .withLatestFrom(this.store.select(state => state.quoteEdit.data.id))
    .switchMap(([action, quoteId]: [QuoteEditActions.AddProject, number]) =>
      this.service.addProject(quoteId)
        .map((quote) => this.store.create(factory =>
          factory.quoteEdit.quoteRefreshAndNotfiy(quote, 'QUOTE.UPDATED'))
        )
    );

  @Effect()
  public removeProject: Observable<Action> = this.actions
    .ofType(QuoteEditActions.RemoveProject.Type)
    .withLatestFrom(this.store.select(state => state.quoteEdit.data.id))
    .switchMap(([action, quoteId]: [QuoteEditActions.RemoveProject, number]) =>
      this.service.removeProject(quoteId, action.projectId)
        .map((quote) => this.store.create(factory =>
          factory.quoteEdit.quoteRefreshAndNotfiy(quote, 'QUOTE.UPDATED'))
        )
    );

  @Effect()
  public updateProject: Observable<Action> = this.actions
    .ofType(QuoteEditActions.UpdateProject.Type)
    .withLatestFrom(this.store.select(state => state.quoteEdit.data.id))
    .switchMap(([action, quoteId]: [QuoteEditActions.UpdateProject, number]) =>
      this.service.updateProject(quoteId, action.project)
        .map((quote) => this.store.create(factory =>
          factory.quoteEdit.quoteRefreshAndNotfiy(quote, 'QUOTE.UPDATED'))
        )
    );

  @Effect()
  public moveLineItem: Observable<Action> = this.actions
    .ofType(QuoteEditActions.MoveLineItem.Type)
    .withLatestFrom(this.store.select(state => state.quoteEdit.data.id))
    .switchMap(([action, quoteId]: [QuoteEditActions.MoveLineItem, number]) =>
      this.service.moveLineItem(quoteId, action.project, action.lineItem)
        .map((quote) => this.store.create(factory =>
          factory.quoteEdit.quoteRefreshAndNotfiy(quote, 'QUOTE.UPDATED'))
        )
    );

  @Effect()
  public cloneLineItem: Observable<Action> = this.actions
    .ofType(QuoteEditActions.CloneLineItem.Type)
    .withLatestFrom(this.store.select(state => state.quoteEdit.data.id))
    .switchMap(([action, quoteId]: [QuoteEditActions.CloneLineItem, number]) =>
      this.service.cloneLineItem(quoteId, action.lineItem)
        .map((quote) => this.store.create(factory =>
          factory.quoteEdit.quoteRefreshAndNotfiy(quote, 'QUOTE.UPDATED'))
        )
    );

  @Effect()
  public editLineItemMarkers: Observable<Action> = this.actions
    .ofType(QuoteEditActions.EditLineItemMarkers.Type)
    .withLatestFrom(this.store.select(state => state.quoteEdit.data.id))
    .switchMap(([action, quoteId]: [QuoteEditActions.EditLineItemMarkers, number]) =>
      this.service.editLineItemMarkers(quoteId, action.lineItem, action.newMarkers)
        .map((quote) => this.store.create(factory =>
          factory.quoteEdit.quoteRefreshAndNotfiy(quote, 'QUOTE.UPDATED'))
        )
    );

  @Effect()
  public updateProjectPriceAttributes: Observable<Action> = this.actions
    .ofType(QuoteEditActions.UpdateProjectPriceAttributes.Type)
    .withLatestFrom(this.store.select(state => state.quoteEdit.data.id))
    .switchMap(([action, quoteId]: [QuoteEditActions.UpdateProjectPriceAttributes, number]) =>
      this.service.updateProjectPriceAttributes(quoteId, action.priceAttributes, action.project)
        .map((quote) => this.store.create(factory =>
          factory.quoteEdit.quoteRefreshAndNotfiy(quote, 'QUOTE.UPDATED'))
        )
    );

  @Effect()
  public quoteRefreshAndNotify: Observable<Action> = this.actions
    .ofType(QuoteEditActions.QuoteRefreshAndNotify.Type)
    .map((action: QuoteEditActions.QuoteRefreshAndNotify) =>
      this.store.create(factory =>
        factory.snackbar.display(action.translationString)
      )
    );

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
