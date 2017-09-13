import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as QuoteEditActions from '../actions/quote-edit.actions';
import { FutureQuoteEditService } from '../services/quote-edit.service';
import { AppStore } from '../../app.store';

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

  @Effect({ dispatch: false })
  public changeRouteOnDeleteSuccess: Observable<Action> = this.actions.ofType(QuoteEditActions.DeleteSuccess.Type)
    .do(() => this.router.navigate(['/quotes']));

  constructor(
    private actions: Actions,
    private store: AppStore,
    private service: FutureQuoteEditService,
    private router: Router
  ) { }
}
