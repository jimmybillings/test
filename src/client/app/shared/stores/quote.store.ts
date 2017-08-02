import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { QuoteState, Quote } from '../interfaces/commerce.interface';
import { User } from '../interfaces/user.interface';
import { LegacyAction } from '../interfaces/common.interface';

const initState: QuoteState = {
  data: {
    id: 0,
    total: 0,
    createdUserId: 0,
    ownerUserId: 0,
    quoteStatus: 'PENDING'
  }
};

export function quote(state: any = initState, action: LegacyAction) {
  switch (action.type) {
    case 'QUOTE.SET_QUOTE':
      return Object.assign({}, { data: action.payload });
    case 'QUOTE.UPDATE_QUOTE':
      return Object.assign({}, state, { data: action.payload });
    case 'QUOTE.ADD_USER':
      const quoteWithUser: any = Object.assign({}, state.data, action.payload);
      return Object.assign({}, { data: quoteWithUser });
    default:
      return state;
  }
};

@Injectable()
export class QuoteStore {
  constructor(private store: Store<any>) { }

  public get data(): Observable<QuoteState> {
    return this.store.select('quote');
  }

  public get state(): QuoteState {
    let s: QuoteState;
    this.data.take(1).subscribe((quote: QuoteState) => s = quote);
    return s;
  }

  public replaceQuote(quote: Quote): void {
    this.store.dispatch({ type: 'QUOTE.SET_QUOTE', payload: quote });
  }

  public updateQuote(quote: Quote): void {
    this.store.dispatch({ type: 'QUOTE.UPDATE_QUOTE', payload: quote });
  }

  public addToQuote(user: User): void {
    this.store.dispatch({
      type: 'QUOTE.ADD_USER',
      payload: {
        createdUserFullName: user.emailAddress,
        createdUserEmailAddress: `${user.firstName} ${user.lastName}`
      }
    });
  }
}
