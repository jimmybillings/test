import { Injectable } from '@angular/core';
import { ActionReducer, Store, Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Quote, Quotes } from '../interfaces/commerce.interface';

const initState: Quotes = {
  items: [],
  pagination: {
    totalCount: 0,
    currentPage: 1,
    pageSize: 20,
    hasNextPage: false,
    hasPreviousPage: false,
    numberOfPages: 0
  }
};

export function quotes(state: any = initState, action: Action) {
  switch (action.type) {
    case 'QUOTES.SET_QUOTES':
      return Object.assign({}, action.payload);
    case 'QUOTES.UPDATE_QUOTES':
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};

@Injectable()
export class QuotesStore {
  constructor(private store: Store<any>) { }

  public get data(): Observable<Quotes> {
    return this.store.select('quotes');
  }

  public get state(): Quotes {
    let s: Quotes;
    this.data.take(1).subscribe((quotes: Quotes) => s = quotes);
    return s;
  }

  public updateQuotes(payload: { items: Quote[] }): void {
    this.store.dispatch({ type: 'QUOTES.UPDATE_QUOTES', payload: payload });
  }

  public setQuotes(payload: any): void {
    this.store.dispatch({
      type: 'QUOTES.SET_QUOTES', payload: {
        'items': payload.items,
        'pagination': {
          'totalCount': payload.totalCount,
          'currentPage': payload.currentPage + 1,
          'hasNextPage': payload.hasNextPage,
          'hasPreviousPage': payload.hasPreviousPage,
          'numberOfPages': payload.numberOfPages,
          'pageSize': payload.pageSize
        }
      }
    });
  }
}
