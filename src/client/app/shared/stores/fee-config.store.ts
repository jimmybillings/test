import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { Address } from '../interfaces/user.interface';
import { FeeConfigState, FeeConfig } from '../interfaces/commerce.interface';
import { LegacyAction } from '../interfaces/common.interface';

const emptyFeeConfigState: FeeConfigState = {
  initialized: false,
  feeConfig: { items: [] }
};

export function feeConfig(state: FeeConfigState = emptyFeeConfigState, action: LegacyAction) {
  switch (action.type) {
    case 'FEE_CONFIG.REPLACE':
      return Object.assign({ initialized: !!(action.payload) }, { feeConfig: action.payload ? action.payload : { items: [] } });
    default:
      return state;
  }
};

@Injectable()
export class FeeConfigStore {
  constructor(private store: Store<any>) { }

  public get data(): Observable<FeeConfigState> {
    return this.store.select('feeConfig');
  }

  public get state(): FeeConfigState {
    let state: FeeConfigState;
    this.data.take(1).subscribe(feeConfigState => state = feeConfigState);
    return state;
  }

  public get initialized(): boolean {
    return !!this.state.initialized;
  }

  public get feeConfig(): FeeConfig {
    return this.state.feeConfig;
  }

  public replaceFeeConfigWith(feeConfig: FeeConfig): void {
    this.store.dispatch({ type: 'FEE_CONFIG.REPLACE', payload: feeConfig });
  }
}
