import { Injectable } from 'angular2/core';
import { Router } from 'angular2/router';
import {CurrentUser} from '../models/current-user.model';

@Injectable()
export class Error {
  
  constructor(public router: Router, private _currentUser: CurrentUser) {}
  
  public handle(error): void {
    switch(error.status) {
      case 401: 
        this._unAuthorized();  
      case 403: 
        this._forbidden();
      default:  
    }
  }
  
  private _unAuthorized(): void {
    let redirect = (this._currentUser.loggedIn()) ? ['UserManagement/Login', {'loggedOut': 'true'}] : ['UserManagement/Login'];
    this._currentUser.destroy();
    this.router.navigate(redirect);
  }
  
  private _forbidden(): boolean {
    return true;
  }
}
