import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUser} from '../services/current-user.model';

@Injectable()
export class Error {

  constructor(public router: Router, private currentUser: CurrentUser) { }

  public handle(error: any): void {
    switch (error.status) {
      case 401:
        this._unAuthorized();
        break;
      case 403:
        this._forbidden();
        break;
      default:
        this._forbidden();
        break;
    }
  }

  private _unAuthorized(): void {
    let redirect = (this.currentUser.loggedIn()) ? ['user/login', { 'loggedOut': 'true' }] : ['user/login'];
    this.currentUser.destroy();
    this.router.navigate(redirect);
  }

  private _forbidden(): boolean {
    return true;
  }
}
