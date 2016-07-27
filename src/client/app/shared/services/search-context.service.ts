import { Injectable } from '@angular/core';
import { Router} from '@angular/router';
import { Store, Reducer, Action} from '@ngrx/store';
import { Observable } from 'rxjs/Rx';

const initSearchContext: any = {
  q: null,
  i: 1,
  n: 100
};

export const searchContext: Reducer<any> = (state: any = initSearchContext, action: Action) => {
  switch (action.type) {
    case 'SEARCHCONTEXT.NEW':
      return Object.assign({}, action.payload);
    case 'SEARCHCONTEXT.UDPATE':
      return Object.assign({}, state, action.payload);
    case 'SEARCHCONTEXT.RESET':
      return Object.assign({}, initSearchContext);
    case 'SEARCHCONTEXT.REMOVE':
      return Object.assign({}, Object.keys(state).reduce((result: any, key: any) => {
        if (key !== action.payload) result[key] = state[key];
        return result;
      }, {}));
    default:
      return state;
  }
};

@Injectable()
export class SearchContext {
  public data: Observable<any>;
  constructor(public router: Router, public store: Store<any>) {
    this.data = this.store.select('searchContext');
  }

  public new(params: Object): void {
    this.store.dispatch({ type: 'SEARCHCONTEXT.NEW', payload: this.decodeParams(params) });
    this.go();
  }

  public get state(): any {
    let s: any;
    this.data.take(1).subscribe(state => s = state);
    return s;
  }

  public set remove(param: any) {
    this.store.dispatch({ type: 'SEARCHCONTEXT.REMOVE', payload: param });
  }

  public set update(params: any) {
    this.store.dispatch({ type: 'SEARCHCONTEXT.UDPATE', payload: this.decodeParams(params) });
  }

  public go(): void {
    this.router.navigate(['/search', this.state]);
  }

  public decodeParams(params: any) {
    let decodedParams: any = {};
    for (let param in params) {
      decodedParams[param] = decodeURIComponent(params[param]);
    }
    return decodedParams;
  }
}
