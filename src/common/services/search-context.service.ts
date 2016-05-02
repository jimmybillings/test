import { Injectable } from 'angular2/core';
import { Router } from 'angular2/router';
import { Store, Reducer, Action} from '@ngrx/store';
import { Observable } from 'rxjs/Rx';

const initSearchContext = {
  q: null,
  i: 0,
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
    this.router.navigate(['/Search', this.store.getState().searchContext]);
  }
  
  public set(params: Object): void {
    this.store.dispatch({type: 'SEARCHCONTEXT.SET', payload: params});
  }
  
}
