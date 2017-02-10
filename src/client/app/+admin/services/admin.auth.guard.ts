import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Capabilities } from '../../shared/services/capabilities.service';
import { ErrorStore } from '../../shared/stores/error.store';
import { CurrentUserService } from '../../shared/services/current-user.service';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private userCan: Capabilities,
    private error: ErrorStore,
    private currentUser: CurrentUserService) { }

  canActivate() {
    if (this.userCan.viewAdmin()) {
      return true;
    } else if (!this.currentUser.loggedIn()) {
      this.error.dispatch({ status: 401 });
      return false;
    } else {
      this.error.dispatch({ status: 403 });
      return false;
    }
  }
}
