import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CurrentUser } from '../../../shared/services/current-user.model';
import { ErrorActions } from '../../../shared/services/error.service';

@Injectable()
export class CartGuard implements CanActivate {
  constructor(
    private currentUser: CurrentUser,
    private error: ErrorActions) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.currentUser.loggedIn()) {
      return true;
    } else {
      this.error.handle({ status: 401 });
      return false;
    }
  }
}
