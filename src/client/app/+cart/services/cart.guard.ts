import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Capabilities } from '../../shared/services/capabilities.service';

@Injectable()
export class CartGuard implements CanActivate {
  constructor(
    private userCan: Capabilities,
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return (this.userCan.viewCart()) ? true : this.router.navigate(['/user/login']) && false;
  }
}
