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
    case 'SEARCHCONTEXT.SET':
      return Object.assign({}, state, action.payload);
    case 'SEARCHCONTEXT.RESET':
      return Object.assign({}, initSearchContext);
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
    this.update = params;
    this.go();
  }

  public get state(): any {
    let s: any;
    this.data.take(1).subscribe(state => s = state);
    return s;
  }

  public set update(params: any) {
    let decodedParams:any = {};
    for(let param in params) {
      decodedParams[param] = decodeURIComponent(params[param]);
    }
    this.store.dispatch({ type: 'SEARCHCONTEXT.SET', payload: decodedParams });
  }

  public go(): void {
    this.router.navigate(['/search', this.state]);
  }
}
