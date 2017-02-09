import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { CurrentUserService } from '../../shared/services/current-user.service';
import { ErrorStore } from '../../shared/stores/error.store';

@Injectable()
export class LoggedOutGuard implements CanActivate {
  constructor(
    private currentUser: CurrentUserService,
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


