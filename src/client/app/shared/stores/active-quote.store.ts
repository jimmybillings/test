import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Store, ActionReducer, Action } from '@ngrx/store';

import { Address } from '../interfaces/user.interface';

const emptyQuote: any = {
  data: {
    userId: NaN,
    total: 0
  }
};

export const activeQuote: ActionReducer<any> = (state: any = emptyQuote, action: Action) => {
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
  constructor(private store: Store<any>) {
    this.data.subscribe(d => console.log(d));
  }

  public get data(): Observable<any> {
    return this.store.select('activeQuote');
  }

  public get state(): any {
    let state: any;
    this.data.take(1).subscribe(quote => state = quote);
    return state;
  }

  public replaceQuoteWith(quote: any): void {
    this.store.dispatch({ type: 'ACTIVE_QUOTE.REPLACE_QUOTE', payload: quote });
  }

  public updateQuoteWith(quoteSummary: any) {
    this.store.dispatch({ type: 'ACTIVE_QUOTE.UPDATE_QUOTE', payload: quoteSummary });
  }
}
