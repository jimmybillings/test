import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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
  public context: Observable<any>;
  constructor(public router: Router, public store: Store<any>) {
    this.context = this.store.select('searchContext');
  }

  public new(params: Object): void {
    this.set(params);
    this.router.navigate(['/search', this.get()]);
  }

  public get(): any {
    return this.store.getState().searchContext;
  }

  public set(params: Object): void {
    this.store.dispatch({ type: 'SEARCHCONTEXT.SET', payload: params });
  }

}
