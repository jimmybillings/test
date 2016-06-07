import { Injectable } from '@angular/core';
import { Router} from '@angular/router';
import { Store, Reducer, Action} from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import {Location} from '@angular/common';
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
  constructor(public router: Router, public store: Store<any>,public loc:Location) {
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
  public go(params: Object): void {
    this.set(params);
    this.loc.go('/search;'+this.toQueryParam(this.get()));
  }
  private toQueryParam(params: any):string {
    console.dir(params);
    let buffer = new Array();
    for (var name in params) {
       if(! params.hasOwnProperty(name)) {
         continue;
       }
       var value = params[name];
       if(value !== null) {
         buffer.push(name + '=' + value);
       }else {
         buffer.push(name +'=');
       }
       console.log('name = '+name+' value= '+value);
       //buffer.push(name + '=' + ( value === null ) ? '' : value );
    }
    console.dir(buffer);
    var source = buffer.join( ';' );
    return( source );
  }
}
