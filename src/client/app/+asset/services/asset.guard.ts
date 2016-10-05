import { Injectable }             from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot }    from '@angular/router';
import { Capabilities } from '../../shared/services/capabilities.service';
import { CurrentUser } from '../../shared/services/current-user.model';
import { ErrorActions } from '../../shared/services/error.service';

@Injectable()
export class AssetGuard implements CanActivate {
  constructor(
    private userCan: Capabilities,
    private currentUser: CurrentUser,
    private router: Router,
    private error: ErrorActions) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.currentUser.loggedIn() && !route.params['share_key']) {
      // Let the api dictate based on site-config whether or 
      // not a logged out user can visit the clip details page.
      return true;
    } else if(this.userCan.viewAssetDetails()) {
      // User has permissions.
      return true;
    } else if(route.params['share_key']) {
      // A Mayfly user with a share token.
      localStorage.setItem('token', route.params['share_key']);
      return true;
    } else {
      // user is logged in but doesn't have permission
      this.error.handle({status: 403});
      return false;
    }
  }
}
