import { Injectable } from '@angular/core';
import { ActionReducer, Action, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { CurrentUser } from './current-user.model';

export const error: ActionReducer<any> = (state = {}, action: Action) => {
  switch (action.type) {
    case 'UPDATE_ERROR':
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};

@Injectable()
export class Error {
  public data: any;
  constructor(private store: Store<any>) {
    this.data = this.store.select('error');
  }

  public dispatch(error: any): void {
    this.store.dispatch({ type: 'UPDATE_ERROR', payload: error });
  }
}

@Injectable()
export class ErrorActions {
  constructor(private error: Error, private router: Router, private currentUser: CurrentUser) {
    this.error.data.subscribe((error: any) => this.handle(error));
  }

  public handle(error: any): void {
    switch (error.status) {
      case 401:
        this.unAuthorized();
        break;
      case 403:
        this.forbidden();
        break;
      default:
        break;
    }
  }

  public unAuthorized(): void {
    let redirect = (this.currentUser.loggedIn()) ? ['/user/login', { 'loggedOut': 'true' }] :
      (this.router.url.indexOf('/user/login') > -1) ? ['/user/login', { 'credentials': 'invalid' }] : ['/user/login'];
    this.currentUser.destroy();
    this.router.navigate(redirect);
  }

  public forbidden(): boolean {
    return true;
  }
}
