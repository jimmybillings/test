import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Capabilities } from '../../shared/services/capabilities.service';
import { CurrentUser } from '../../shared/services/current-user.model';
import { ErrorStore } from '../../shared/stores/error.store';

@Injectable()
export class CollectionGuard implements CanActivate {
  constructor(
    private userCan: Capabilities,
    private currentUser: CurrentUser,
    private router: Router,
    private error: ErrorStore) { }

  canActivate() {
    if (this.currentUser.loggedIn() && this.userCan.viewCollections()) {
      return true;
    } else {
      if (this.currentUser.loggedIn() && !this.userCan.viewCollections()) {
        this.error.dispatch({ status: 403 });
      } else {
        this.error.dispatch({ status: 401 });
      }
      return false;
    }
  }

}


