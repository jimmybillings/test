import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { CurrentUser } from '../../shared/services/current-user.model';
import { ErrorStore } from '../../shared/stores/error.store';

@Injectable()
export class LoggedOutGuard implements CanActivate {
  constructor(
    private currentUser: CurrentUser,
    private error: ErrorStore) { }

  canActivate() {
    if (this.currentUser.loggedIn()) {
      return true;
    } else {
      this.error.dispatch({ status: 401 });
      return false;
    }
  }

}


