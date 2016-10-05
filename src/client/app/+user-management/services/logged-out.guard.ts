import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { CurrentUser } from '../../shared/services/current-user.model';
import { ErrorActions } from '../../shared/services/error.service';

@Injectable()
export class LoggedOutGuard implements CanActivate {
  constructor(
    private currentUser: CurrentUser,
    private error: ErrorActions) { }

  canActivate() {
    if (this.currentUser.loggedIn()) {
      return true;
    } else {
      this.error.handle({ status: 401 });
      return false;
    }
  }

}


