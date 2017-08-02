import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { LegacyAction } from '../interfaces/common.interface';

const initSearchContext: any = {
  q: null,
  i: 1,
  n: 100,
  sortId: 0
};

export function searchContext(state: any = initSearchContext, action: LegacyAction) {
  switch (action.type) {
    case 'SEARCHCONTEXT.CREATE':
      return Object.assign({}, action.payload);
    case 'SEARCHCONTEXT.UPDATE':
      return Object.assign({}, state, action.payload);
    case 'SEARCHCONTEXT.RESET':
      return Object.assign({}, initSearchContext);
    case 'SEARCHCONTEXT.REMOVE':
      return Object.assign({}, Object.keys(state).reduce((result: any, key: any) => {
        if (action.payload.indexOf(key) === -1) result[key] = state[key];
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
    this.create = params;
    this.go();
  }

  public get state(): any {
    let s: any;
    this.data.take(1).subscribe(state => s = state);
    return s;
  }

  public set remove(param: string[] | string) {
    if (!Array.isArray(param)) param = [param];
    this.store.dispatch({ type: 'SEARCHCONTEXT.REMOVE', payload: param });
  }

  public set update(params: any) {
    this.store.dispatch({ type: 'SEARCHCONTEXT.UPDATE', payload: this.decodeParams(params) });
  }

  public set create(params: any) {
    this.store.dispatch({ type: 'SEARCHCONTEXT.CREATE', payload: this.decodeParams(params) });
  }

  public go(): void {
    this.router.navigate(['/search', this.state]);
  }

  private decodeParams(params: any) {
    let decodedParams: any = {};
    let d: any = JSON.parse(JSON.stringify(params));
    for (let param in d) {
      if (d[param] === '' || params[param] === 'true') {
        delete d[param];
        return d;
      }
      decodedParams[param] = decodeURIComponent(params[param]);
    }
    return decodedParams;
  }
}
