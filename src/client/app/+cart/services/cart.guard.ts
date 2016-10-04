import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CurrentUser } from '../../shared/services/current-user.model';

@Injectable()
export class CartGuard implements CanActivate {
  constructor(
    private currentUser: CurrentUser,
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return (this.currentUser.loggedIn()) ? true : this.router.navigate(['/user/login']) && false;
  }
}
