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
  private callInProgress: boolean = false;
  constructor(private error: Error, private router: Router, private currentUser: CurrentUser) {
    this.error.data.subscribe(this.handle.bind(this));
  }

  public handle(error: any): void {
    switch (error.status) {
      case 401:
        console.log('401');
        if (!this.callInProgress) {
          this.callInProgress = true;
          this.unAuthorized();
          setTimeout(() => this.callInProgress = false, 5000);
        }
        break;
      case 403:
        console.log('403');
        if (!this.callInProgress) {
          this.callInProgress = true;
          this.forbidden();
          setTimeout(() => this.callInProgress = false, 5000);
        }
        break;
      default:
        break;
    }
  }

  public unAuthorized(): void {

    let redirect: any;
    if (this.currentUser.loggedIn()) {
      // SESSION HAS EXPIRED
      this.currentUser.destroy();
      redirect = ['/user/login', { 'loggedOut': 'true' }];
    } else {
      // INCORRECT LOGIN ATTEMPT
      if (this.router.url.indexOf('/user/login') > -1) {
        redirect = ['/user/login', { 'credentials': 'invalid' }];
      } else {
        // REQUIRED TO BE LOGGED IN
        redirect = ['/user/login', { 'requireLogin': 'true' }];
      }
    }
    this.router.navigate(redirect);
  }

  public forbidden(): void {
    var redirect: any = ['/user/profile', { 'permission': 'required' }];
    this.router.navigate(redirect);
  }
}
