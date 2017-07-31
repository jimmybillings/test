import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { PricingState } from '../interfaces/commerce.interface';
import { LegacyAction } from '../interfaces/common.interface';

const initState = {
  priceForDetails: NaN,
  priceForDialog: NaN
};

export function pricingReducer(state: PricingState = initState, action: LegacyAction) {
  switch (action.type) {
    case 'SET_PRICE_FOR_DIALOG':
      return Object.assign({}, state, { priceForDialog: action.payload });
    case 'SET_PRICE_FOR_DETAILS':
      return Object.assign({}, state, { priceForDetails: action.payload });
    default:
      return state;
  }
}

@Injectable()
export class PricingStore {
  constructor(private store: Store<any>) { }  // Was Store<PricingState> before ngrx upgrade.

  public get data(): Observable<PricingState> {
    return this.store.select('paymentReducer');
  }

  public get state(): PricingState {
    let s: PricingState;
    this.data.take(1).subscribe(data => s = data);
    return s;
  }

  public get priceForDialog(): Observable<number> {
    return this.data.map((data: PricingState) => data.priceForDialog);
  }

  public get priceForDetails(): Observable<number> {
    return this.data.map((data: PricingState) => data.priceForDetails);
  }

  /**
   * @param { price } number
   * setPriceForDialog - modifies the store
   */
  public setPriceForDialog(price: number) {
    this.store.dispatch({ type: 'SET_PRICE_FOR_DIALOG', payload: price });
  }

  /**
   * @param { number } number
   * setPriceForDetails
   */
  public setPriceForDetails(price: number) {
    this.store.dispatch({ type: 'SET_PRICE_FOR_DETAILS', payload: price });
  }
}
