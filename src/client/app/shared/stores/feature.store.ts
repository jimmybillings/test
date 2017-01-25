import { Injectable } from '@angular/core';
import { Store, ActionReducer, Action } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { Feature, Features } from '../interfaces/feature.interface';

const initState: Features = {
  collection: true,
  cart: false
};

export const features: ActionReducer<any> = (state: Features = initState, action: Action) => {
  switch (action.type) {
    case 'FEATURE.SET_STATE':
      return Object.assign({}, action.payload);
    default:
      return state;
  }
};

@Injectable()
export class FeatureStore {
  constructor(private store: Store<any>) { }

  public access(feature: Feature): boolean {
    // is there a better way to do this? Should the state be index(number) based?
    return this.state[Feature[feature]];
  }

  public setData(data: any): void {
    this.store.dispatch({ type: 'FEATURE.SET_STATE', payload: data });
  }

  public get data(): Observable<Features> {
    return this.store.select('features');
  }

  public get state(): Features {
    let s: any;
    this.data.take(1).subscribe((data: any) => s = data);
    return s;
  }
}
