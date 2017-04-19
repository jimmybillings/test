import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store, ActionReducer, Action } from '@ngrx/store';

import { Address } from '../interfaces/user.interface';
import { QuoteState } from '../interfaces/commerce.interface';

const emptyQuote: QuoteState = {
  data: {
    id: 0,
    total: 0,
    createdUserId: 0,
    ownerUserId: 0,
    quoteStatus: 'PENDING'
  }
};

export function activeQuote(state: any = emptyQuote, action: Action) {
  switch (action.type) {
    case 'ACTIVE_QUOTE.REPLACE_QUOTE':
      return Object.assign({}, state, { data: action.payload });
    case 'ACTIVE_QUOTE.UPDATE_QUOTE':
      let newQuote: any = Object.assign({}, state.data, { total: action.payload.total, itemCount: action.payload.itemCount });
      return Object.assign({}, state, { data: newQuote });
    default:
      return state;
  }
};

@Injectable()
export class ActiveQuoteStore {
  constructor(private store: Store<any>) { }

  public get data(): Observable<QuoteState> {
    return this.store.select('activeQuote');
  }

  public get state(): QuoteState {
    let state: any;
    this.data.take(1).subscribe(quote => state = quote);
    return state;
  }

  public replaceQuote(quote: any): void {
    this.store.dispatch({ type: 'ACTIVE_QUOTE.REPLACE_QUOTE', payload: quote });
  }

  public updateQuote(quoteSummary: any) {
    this.store.dispatch({ type: 'ACTIVE_QUOTE.UPDATE_QUOTE', payload: quoteSummary });
  }
}
