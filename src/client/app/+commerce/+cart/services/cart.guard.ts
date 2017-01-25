import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CartCapabilities } from './cart.capabilities';
import { ErrorActions } from '../../../shared/services/error.service';

@Injectable()
export class CartGuard implements CanActivate {
  constructor(
    private userCan: CartCapabilities,
    private error: ErrorActions) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.userCan.addToCart()) {
      return true;
    } else {
      this.error.handle({ status: 403 });
      return false;
    }
  }
}
