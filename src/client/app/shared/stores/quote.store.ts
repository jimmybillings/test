import { Injectable } from '@angular/core';
import { ActionReducer, Store, Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { QuoteState, Quote } from '../interfaces/quote.interface';

const initState: QuoteState = {
  data: {
    id: 0,
    total: 0,
    createdUserId: 0,
    ownerUserId: 0,
    quoteStatus: 'PENDING'
  },
  orderInProgress: {
    purchaseOptions: {
      purchaseOnCredit: false,
      creditExemption: false
    },
    addresses: [],
    selectedAddress: {
      type: '',
      name: '',
      defaultAddress: undefined,
      addressEntityId: undefined,
      address: {
        address: '',
        state: '',
        city: '',
        country: '',
        zipcode: '',
        phone: ''
      }
    },
    authorization: {
      card: {
        brand: '',
        last4: '',
        exp_month: '',
        exp_year: ''
      }
    },
    selectedPurchaseType: ''
  }
};

export function quote(state: any = initState, action: Action) {
  switch (action.type) {
    case 'QUOTE.SET_QUOTE':
      return Object.assign({}, { data: action.payload });
    case 'QUOTE.UPDATE_QUOTE':
      return Object.assign({}, state, { data: action.payload });
    case 'QUOTE.UPDATE_ORDER_IN_PROGRESS':
      state.orderInProgress[action.payload.key] = action.payload.data;
      return Object.assign({}, state);
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

  public updateOrderInProgress(key: string, data: any): void {
    this.store.dispatch({ type: 'QUOTE.UPDATE_ORDER_IN_PROGRESS', payload: { key, data } });
  }
}
