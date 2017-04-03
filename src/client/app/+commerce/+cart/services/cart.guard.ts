import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CommerceCapabilities } from '../../services/commerce.capabilities';
import { ErrorStore } from '../../../shared/stores/error.store';

@Injectable()
export class CartGuard implements CanActivate {
  constructor(
    private userCan: CommerceCapabilities,
    private error: ErrorStore) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.userCan.addToCart()) {
      return true;
    } else {
      this.error.dispatch({ status: 403 });
      return false;
    }
  }
}
