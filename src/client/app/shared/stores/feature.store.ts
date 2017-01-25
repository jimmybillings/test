import { Injectable } from '@angular/core';
import { Store, ActionReducer, Action } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { Feature, Features } from '../interfaces/feature.interface';

const initState: Features = {
  disableCartAccess: false,
  disableCollectionAccess: false
};

export const features: ActionReducer<any> = (state: Features = initState, action: Action) => {
  switch (action.type) {
    case 'FEATURE.SET_STATE':
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};

@Injectable()
export class FeatureStore {
  constructor(private store: Store<any>) { }

  public isAvailable(feature: Feature): boolean {
    return !this.state[Feature[feature]];
  }

  public set(data: any): void {
    this.store.dispatch({ type: 'FEATURE.SET_STATE', payload: this.format(data) });
  }

  public get data(): Observable<Features> {
    return this.store.select('features');
  }

  public get state(): Features {
    let s: Features;
    this.data.take(1).subscribe((state: Features) => s = state);
    return s;
  }

  private format(data: any): Features {
    for (let key in data) {
      data[key] = JSON.parse(data[key]);
    }
    return data;
  }
}
