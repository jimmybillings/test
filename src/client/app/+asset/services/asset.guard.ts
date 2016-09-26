import { Injectable }             from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot }    from '@angular/router';
import { UserPermission } from '../../shared/services/permission.service';
import { CurrentUser } from '../../shared/services/current-user.model';

@Injectable()
export class AssetGuard implements CanActivate {
  constructor(
    private currentUser: CurrentUser,
    private permission: UserPermission,
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return (this.canView(route)) ? true : this.router.navigate(['/user/login']) && false;
  }

  private canView(route: ActivatedRouteSnapshot): boolean {
    if (route.queryParams['share_key']) {
      localStorage.setItem('token', route.queryParams['share_key']);
      return true;
    } else {
      return this.currentUser.loggedIn() && (this.permission.has('Root') || this.permission.has('ViewClips'));
    }
  }
}
