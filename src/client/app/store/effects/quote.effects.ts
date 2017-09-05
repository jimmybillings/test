import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';

import * as QuoteActions from '../actions/quote.actions';
import { FutureQuoteEditService } from '../services/quote-edit.service';
import { AppStore } from '../../app.store';

@Injectable()
export class QuoteEffects {
  @Effect()
  public load: Observable<Action> = this.actions.ofType(QuoteActions.Load.Type)
    .switchMap(() => this.service.load())
    .map(quote => this.store.create(factory => factory.quote.loadSuccess(quote)))
    .catch(error => Observable.of(this.store.create(factory => factory.quote.loadFailure(error))));

  constructor(private actions: Actions, private store: AppStore, private service: FutureQuoteEditService) { }
}
