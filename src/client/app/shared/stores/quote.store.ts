import { Injectable } from '@angular/core';
import { ActionReducer, Store, Action } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { Quote } from '../interfaces/quote.interface';

const initState: any = {};

export function quote(state: any = initState, action: Action) {
  switch (action.type) {
    case 'QUOTE.SET_QUOTE':
      return Object.assign({}, action.payload);
    default:
      return state;
  }
};

@Injectable()
export class QuoteStore {
  constructor(private store: Store<any>) { }

  public get data(): Observable<Quote> {
    return this.store.select('quote');
  }

  public get state(): Quote {
    let s: Quote;
    this.data.take(1).subscribe((quote: Quote) => s = quote);
    return s;
  }

  public setQuote(quote: Quote): void {
    this.store.dispatch({ type: 'QUOTE.SET_QUOTE', payload: quote });
  }
}
