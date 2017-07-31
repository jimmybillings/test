import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { LegacyAction } from '../interfaces/common.interface';
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

export function activeQuote(state: any = emptyQuote, action: LegacyAction) {
  switch (action.type) {
    case 'ACTIVE_QUOTE.REPLACE_QUOTE':
      return Object.assign({}, state, { data: action.payload });
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
}
